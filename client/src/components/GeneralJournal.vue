<template>
  <div class="general-journal">
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
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field
                  height="4"
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
                  <GeneralJournalDialog
                    :memo="memo"
                    :BookId="BookId"
                    :date="date"
                    @close-dialog="dialog = false"
                    @add-transaction="add"
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
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </template>
                  <v-card>
                    <v-toolbar color="red lighten-1" dark>
                      <v-toolbar-title>Delete</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <p class="subtitle-1 mt-5">Are you sure you want to delete?</p>
                    </v-card-text>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="primary" text @click="dialogDelete = false">
                        Cancel
                      </v-btn>
                      <v-btn color="red" text @click="clear">
                        Delete
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
              hide-default-footer
              disable-sort
              :headers="headers"
              :items="indexedItems"
              item-key="id"
              no-data-text="Add General Journal transactions"
              class="elevation-3"
            >
              <template v-slot:body.append="{ headers }">
                <tr>
                  <td></td>
                  <td>
                    <span class="font-weight-bold caption">Total:</span>
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
            </v-data-table>
          </v-card-text>
        </v-card>
        <RecordStatus :hidden="hidden"
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
import RecordStatus from '@/components/status/RecordStatus'
import GeneralJournalDialog from './GeneralJournalDialog'
import { mapState, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'GeneralJournal',
  components: { GeneralJournalDialog, RecordStatus },
  data () {
    return {
      selected: [],
      snackbar: false,
      timeout: 2000,
      BookId: 1,
      dialog: false,
      dialogDelete: false,
      memo: '',
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ],
      items: [],
      hidden: true
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add (transaction) {
      this.items = [ ...this.items, transaction ]
    },
    clearAll () {
      this.memo = ''
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
        const newTransaction = JSON.stringify(
          {
            BranchId: this.auth.user.BranchId,
            BookId: this.BookId,
            memo: this.memo,
            date: this.date,
            data: this.formatItems
          }
        )
        const response = await axios.post('/api/bookkeeping/general-journal', newTransaction, config)
        const savedTransaction = response.data
        if (!savedTransaction) console.log('Failed')
        this.snackbar = true
        this.clearAll()
        this.hidden = false
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  },
  computed: {
    ...mapState(['auth']),
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
