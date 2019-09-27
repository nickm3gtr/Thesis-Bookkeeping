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
                  <GeneralJournalDialog
                    :transId="transId"
                    :memo="memo"
                    :BookId="BookId"
                    :date="date"
                    @close-dialog="dialog = false"
                    @add-transaction="add"
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
              no-data-text="Add General Journal transactions"
              class="elevation-3"
            >
              <template v-slot:body.append="{ headers }">
                <tr>
                  <td>
                    <span class="font-weight-bold">Total:</span>
                  </td>
                  <td>
                    <span v-if="sumDebit === 0"></span>
                    <span v-else :class="{ 'red--text': isNotTheSame }">{{ sumDebit }}</span>
                  </td>
                  <td>
                    <span v-if="sumCredit === 0"></span>
                    <span v-else :class="{ 'red--text': isNotTheSame }">{{ sumCredit }}</span>
                  </td>
                </tr>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon
                  small
                  @click="deleteItem(item)"
                >
                  delete
                </v-icon>
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
import GeneralJournalDialog from './GeneralJournalDialog'
import { mapActions } from 'vuex'
import uuid from 'uuid/v4'
import axios from 'axios'

export default {
  name: 'GeneralJournal',
  components: { GeneralJournalDialog },
  data () {
    return {
      snackbar: false,
      timeout: 0,
      transId: uuid(),
      BookId: 1,
      dialog: false,
      memo: '',
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' },
        { text: 'Actions', align: 'center', value: 'action', sortable: false }
      ],
      items: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add (transaction) {
      this.items = [ ...this.items, transaction ]
    },
    clear () {
      this.items = []
      this.memo = ''
    },
    closeSnackBar () {
      this.snackbar = false
      this.clear()
    },
    deleteItem (item) {
      const index = this.items.indexOf(item)
      this.items.splice(index, 1)
    },
    async save () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const newTransaction = JSON.stringify({ data: this.formatItems })
        const response = await axios.post('/api/bookkeeping/general-journal', newTransaction, config)
        const savedTransaction = response.data
        if (!savedTransaction) console.log('Failed')
        this.snackbar = true
        this.transId = uuid()
      } catch (e) {
        this.getError(e.response.data)
        this.transId = uuid()
      }
    }
  },
  computed: {
    formatItems () {
      const formatItem = this.items.map(item => {
        if (item.debit.length <= 0) {
          item.debit = null
        } else if (item.credit.length <= 0) {
          item.credit = null
        }
        return item
      })
      return formatItem
    },
    totalDebit () {
      const sumDebit = this.items.map(item => {
        return +item.debit
      })
      return sumDebit
    },
    totalCredit () {
      const sumCredit = this.items.map(item => {
        return +item.credit
      })
      return sumCredit
    },
    sumDebit () {
      let sum = 0
      for (let i = 0; i < this.totalDebit.length; i++) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        sum += this.totalDebit[i]
      }
      return sum
    },
    sumCredit () {
      let sum = 0
      for (let i = 0; i < this.totalCredit.length; i++) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        sum += this.totalCredit[i]
      }
      return sum
    },
    isNotTheSame () {
      return this.sumDebit !== this.sumCredit
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
