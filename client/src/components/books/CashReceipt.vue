<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
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
                  label="Memo"
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
                    :transId="transId"
                    :memo="memo"
                    :BookId="BookId"
                    :date="date"
                    :num="num"
                    @add-transaction="add"
                    @close-dialog="dialog = false"
                  />
                </v-dialog>
              </v-col>
              <v-col cols="12" md="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn color="red" v-on="on" dark fab small class="mt-4"
                           :class="{'disable-events': selectedItems}"
                           @click="clear">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Clear All</span>
                </v-tooltip>
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
              hide-default-footer
              disable-sort
              :headers="headers"
              :items="items"
              no-data-text="Add Cash Receipt Book Transactions"
              class="elevation-3"
            >
              <template v-slot:body.append="{ headers }">
                <tr>
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
import uuid from 'uuid/v4'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import CashReceiptDialog from '@/components/books/CashReceiptDialog'

export default {
  name: 'CashReceipt',
  components: { CashReceiptDialog },
  data () {
    return {
      snackbar: false,
      timeout: 0,
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      transId: uuid(),
      BookId: 2,
      dialog: false,
      num: '',
      memo: '',
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Amount', value: 'credit' }
      ],
      items: []
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
          AccountName: '11110-Cash on Hand',
          BookId: this.BookId,
          BookkeeperId: this.auth.user.id,
          TransId: this.transId,
          debit: this.totalCash,
          credit: null,
          date: this.date,
          memo: this.memo,
          num: this.num
        }
        const data = [ cashItem, ...this.items ]
        const newData = data.map(data => {
          data.num = this.num
          data.memo = this.memo
          return data
        })
        const newTransaction = JSON.stringify({ data: newData })
        const response = await axios.post('/api/bookkeeping/cash-receipts', newTransaction, config)
        const savedTransaction = response.data
        if (!savedTransaction) console.log('Failed')
        this.clear()
        this.snackbar = true
        this.transId = uuid()
      } catch (e) {
        this.getError(e.response.data)
        this.transId = uuid()
      }
    },
    clear () {
      this.items = []
      this.memo = ''
      this.num = ''
    },
    closeSnackBar () {
      this.snackbar = false
      this.clear()
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
    selectedItems () {
      return this.items <= 0
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
