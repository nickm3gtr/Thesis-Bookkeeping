<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined elevation="10">
          <v-toolbar color="light-blue darken-3" dark>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Select Date"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title @input="menu = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="OR number"
                  v-model="num"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field
                  outlined
                  label="Description"
                  v-model="memo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-dialog persistent v-model="dialog" max-width="600px">
                  <template v-slot:activator="{ on: dialog }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn color="primary" dark fab small class="mt-4" v-on="{ ...dialog, ...tooltip }">
                          <v-icon>note_add</v-icon>
                        </v-btn>
                      </template>
                      <span>Add</span>
                    </v-tooltip>
                  </template>
                  <CashReceiptDialog
                    @add-transaction="add"
                    @close-dialog="dialog = false"
                  />
                </v-dialog>
              </v-col>
              <v-col cols="12" md="1">
                <v-dialog
                  v-model="dialogDelete"
                  width="500"
                >
                  <template v-slot:activator="{ on: deleteDialog }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn color="red" v-on="{ ...deleteDialog, ...tooltip }"
                               dark fab small class="mt-4" :class="{'disable-events': deleteItems}">
                          <v-icon>remove</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove</span>
                    </v-tooltip>
                  </template>
                  <v-card>
                    <v-toolbar color="red lighten-1" dark>
                      <v-toolbar-title>Remove</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <p class="subtitle-1 mt-5">Are you sure you want to remove?</p>
                    </v-card-text>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="primary" text @click="dialogDelete = false">
                        Cancel
                      </v-btn>
                      <v-btn color="red" text @click="clear">
                        Remove
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="12" md="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" v-on="on" dark fab small class="mt-4"
                           :class="{'disable-events': selectedItems}"
                           @click="save">
                      <v-icon>save</v-icon>
                    </v-btn>
                  </template>
                  <span>Save</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-data-table
              v-model="selected"
              show-select
              item-key="id"
              hide-default-footer
              disable-sort
              :headers="headers"
              :items="indexedItems"
              no-data-text="Add Cash Receipt Book Transactions"
              class="elevation-3"
            >
              <template v-slot:body.append="{ headers }">
                <tr>
                  <td></td>
                  <td>
                    <span class="font-weight-bold">Total:</span>
                  </td>
                  <td>
                    <span v-if="totalCash === 0"></span>
                    <span v-else>{{ totalCash }}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <RecordStatus :hidden="hidden"
                      :statusId="statusId"
                      @close-status="hidden=true"
        />
      </v-flex>
    </v-layout>
    <div class="text-center">
      <v-snackbar
        v-model="snackbar"
        bottom="bottom"
        color="green"
        :timeout="timeout"
      >
        Saved!
        <v-btn
          color="white"
          text
          @click="closeSnackBar"
        >
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import CashReceiptDialog from '@/components/books/CashReceiptDialog'
import RecordStatus from '@/components/status/RecordStatus'

export default {
  name: 'CashReceipt',
  components: { CashReceiptDialog, RecordStatus },
  data () {
    return {
      selected: [],
      dialogDelete: false,
      snackbar: false,
      timeout: 2000,
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      BookId: 2,
      dialog: false,
      num: '',
      memo: '',
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Amount', value: 'credit' }
      ],
      items: [],
      hidden: true,
      statusId: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add (transaction) {
      this.items = [ ...this.items, transaction ]
    },
    async save () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const cashItem = {
          AccountId: 11110,
          debit: this.totalCash,
          credit: null
        }
        const data = [ cashItem, ...this.items ]
        const newTransaction = JSON.stringify({
          BookkeeperId: this.auth.user.id,
          BookId: this.BookId,
          memo: this.memo,
          num: this.num,
          date: this.date,
          data: data
        })
        const response = await axios.post('/api/bookkeeping/general-journal', newTransaction, config)
        const savedTransaction = response.data
        if (!savedTransaction) console.log('Failed')
        this.snackbar = true
        this.clearAll()
        this.statusId++
        this.hidden = false
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    clearAll () {
      this.memo = ''
      this.num = ''
      this.items = []
    },
    clear () {
      for (let i = 0; i < this.selected.length; i++) {
        const index = this.items.indexOf(this.selected[i])
        this.items.splice(index, 1)
      }
      this.selected = []
      this.dialogDelete = false
    },
    closeSnackBar () {
      this.snackbar = false
      this.clearAll()
    }
  },
  computed: {
    ...mapState(['auth']),
    totalCash () {
      let balances = this.items.map(item => {
        let balance = parseFloat(item.credit)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    indexedItems () {
      return this.items.map((item, index) => ({
        id: index,
        ...item
      }))
    },
    selectedItems () {
      return this.items <= 0
    },
    deleteItems () {
      return this.selected <= 0
    }
  }
}
</script>

<style scoped>
  .disable-events {
    pointer-events: none;
    opacity: 0.6;
  }
</style>
