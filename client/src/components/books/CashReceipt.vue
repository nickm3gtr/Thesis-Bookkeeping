<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="mt-6">
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
                <v-btn color="primary" dark fab small class="mt-4" @click="add">
                  <v-icon>note_add</v-icon>
                </v-btn>
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
              item-key="index"
              hide-default-footer
              disable-sort
              :headers="headers"
              :items="items"
              no-data-text="Add Cash Receipt Book Transactions"
              class="elevation-3"
            >
              <template v-slot:item.AccountName="props">
                <v-edit-dialog
                  :return-value.sync="props.item.AccountName"
                > {{ props.item.AccountName }}
                  <template v-slot:input>
                    <v-combobox
                      v-model="props.item.Account"
                      :items="filterAccounts"
                      item-text="name"
                      label="Select Account Name"
                      return-object
                    ></v-combobox>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.SubAccount="props">
                <v-edit-dialog
                  :return-value.sync="props.item.SubAccount"
                > {{ props.item.SubAccount }}
                  <template v-slot:input>
                    <v-combobox
                      v-if="!props.item.Account.sub"
                      v-model="props.item.SubAccount"
                      item-text="sub.name"
                      label="Select Account Name"
                      return-object
                    ></v-combobox>
                    <v-combobox
                      v-else-if="props.item.Account !== ''"
                      v-model="props.item.Sub"
                      :items="props.item.Account.sub.subaccounts"
                      item-text="name"
                      label="Select Account Name"
                      return-object
                    ></v-combobox>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.credit="props">
                <v-edit-dialog
                  :return-value.sync="props.item.credit"
                > {{ props.item.credit }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.credit"
                      label="Amount"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:body.append="{ headers }">
                <tr>
                  <td></td>
                  <td>
                    <span class="font-weight-bold">Total:</span>
                  </td>
                  <td></td>
                  <td>
                    <span v-if="sumCredit === 0"></span>
                    <span v-else>{{ sumCredit }}</span>
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
import RecordStatus from '@/components/status/RecordStatus'

export default {
  name: 'CashReceipt',
  components: { RecordStatus },
  data () {
    return {
      accounts: [],
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
        { text: '#', value: 'row' },
        { text: 'AccountName', value: 'AccountName' },
        { text: 'SubAccount', value: 'SubAccount' },
        { text: 'Amount', value: 'credit' }
      ],
      items: [
        { row: 1, Account: '', AccountName: '', Sub: '', SubAccount: '', debit: null, credit: '', index: Math.random() }
      ],
      hidden: true,
      statusId: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      this.items = [...this.items, { row: this.computeRow, Account: '', AccountName: '', Sub: '', SubAccount: '', debit: null, credit: '', index: Math.random() }]
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
          AccountId: 1,
          debit: this.sumCredit,
          credit: null
        }
        const data = [ cashItem, ...this.formatItems ]
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
      this.items = [
        { Account: '', AccountName: '', Sub: '', SubAccount: '', debit: null, credit: '', index: Math.random() }
      ]
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
    formatItems () {
      const item = this.items.map(item => {
        let newItem = ''
        if (item.SubAccount === '' || item.SubAccount === null) {
          newItem = {
            AccountId: item.Account.id,
            AccountName: item.AccountName,
            debit: null,
            credit: item.credit,
            sub: null
          }
        } else {
          if (item.Sub.id) {
            newItem = {
              AccountId: item.Account.id,
              AccountName: item.AccountName,
              debit: null,
              credit: item.credit,
              sub: { name: { id: item.Sub.id, name: item.SubAccount } }
            }
          } else {
            newItem = {
              AccountId: item.Account.id,
              AccountName: item.AccountName,
              debit: null,
              credit: item.credit,
              sub: { name: { name: item.SubAccount } }
            }
          }
        }
        return newItem
      })
      return item
    },
    totalCredit () {
      const sumCredit = this.items.map(item => {
        return +item.credit
      })
      return sumCredit
    },
    sumCredit () {
      let sum = 0
      for (let i = 0; i < this.totalCredit.length; i++) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        sum += this.totalCredit[i]
      }
      return sum
    },
    selectedItems () {
      return this.items <= 0
    },
    deleteItems () {
      return this.selected <= 0
    },
    filterAccounts () {
      return this.accounts.filter(account => {
        return account.SubTypeId === 11200 || account.SubTypeId === 40100 || account.SubTypeId === 40200 || account.SubTypeId === 40300 || account.SubTypeId === 40400
      })
    },
    computeRow () {
      const index = this.items.length
      if (index < 1) {
        return 1
      } else {
        const row = this.items[index - 1].row
        return row + 1
      }
    }
  },
  async mounted () {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      this.loading = true
      const response = await axios.get('/api/accounts', config)
      this.accounts = response.data
      this.loading = false
    } catch (e) {
      this.getError(e.response.data)
      this.loading = false
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
