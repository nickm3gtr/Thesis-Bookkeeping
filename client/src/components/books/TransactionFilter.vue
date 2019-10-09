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
                  :disabled="!editable"
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
                  label="Num"
                  v-model="num"
                  :readonly="!editable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-switch v-model="editable" label="Edit"></v-switch>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="primary"
                  class="mt-2"
                  :disabled="!editable"
                  @click="transactionUpdated"
                >
                  Update
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field
                  outlined
                  label="Description"
                  v-model="memo"
                  :readonly="!editable"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <TransactionFilterDialog
                :transaction="propTransaction"
                @close-dialog="closeUpdateDialog"
               />
            </v-dialog>
            <v-simple-table class="mb-10">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Account</th>
                    <th class="text-left">Debit</th>
                    <th class="text-left">Credit</th>
                    <th class="text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in transactions" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>
                      <p v-if="item.debit == 0"></p>
                      <p v-else>{{ item.debit }}</p>
                    </td>
                    <td>
                      <p v-if="item.credit == 0"></p>
                      <p v-else>{{ item.credit }}</p>
                    </td>
                    <td>
                      <v-btn
                        class="mt-0"
                        dark
                        x-small
                        color="primary"
                        :disabled="!editable"
                        @click="openUpdateDialog(index)"
                      >
                        <v-icon small>edit</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="status == 'created'">
              <p class="caption">Transaction recorded on {{createdAt}}</p>
            </div>
            <div v-else>
              <p class="caption">Transaction updated on {{updatedAt}}</p>
            </div>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" bottom="bottom" color="primary" :timeout="timeout">
          Updated!
          <v-btn color="white" text @click="snackbar=false">Close</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import TransactionFilterDialog from './TransactionFilterDialog'

export default {
  name: 'TransactionFilter',
  components: { TransactionFilterDialog },
  data () {
    return {
      menu: false,
      dialog: false,
      date: '',
      num: '',
      memo: '',
      status: '',
      createdAt: '',
      updatedAt: '',
      search: '',
      transactions: [],
      loading: false,
      headers: [
        { text: 'Account', value: 'name' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ],
      propTransaction: '',
      update: 0,
      timeout: 2000,
      snackbar: false,
      editable: false
    }
  },
  methods: {
    openUpdateDialog (index) {
      this.propTransaction = this.transactions[index]
      this.dialog = true
    },
    closeUpdateDialog () {
      this.dialog = false
      this.propTransaction = ''
    },
    async transactionUpdated () {
      const updateData = JSON.stringify({
        transaction: {
          date: this.date,
          num: this.num,
          memo: this.memo,
          updatedAt: new Date()
        },
        transRecord: this.formatTransactions
      })
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }

      try {
        await axios.put(`/api/bookkeeping/transactions/transaction/${this.$route.params.transId}`,
          updateData, config)
      } catch (e) {
        this.getError(e.response.data)
      }
      this.update++
      this.editable = false
      this.snackbar = true
    },
    formatDate (date) {
      return moment(date).format('YYYY-M-D')
    },
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }
  },
  computed: {
    formatTransactions () {
      return this.transactions.map(transaction => {
        // eslint-disable-next-line eqeqeq
        if (transaction.credit == null || transaction.credit == 0) {
          transaction.debit = parseInt(transaction.debit)
        } else {
          transaction.credit = parseInt(transaction.credit)
        }
        return transaction
      })
    },
    totalDebit () {
      let balances = this.transactions.map(item => {
        let balance = parseFloat(item.debit)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(sum)
    },
    totalCredit () {
      let balances = this.transactions.map(item => {
        let balance = parseFloat(item.credit)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(sum)
    }
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      this.loading = true
      const response = await axios.get(`/api/bookkeeping/transaction-records/trans_id/${this.$route.params.transId}`)
      const trans = await axios.get(
        `/api/bookkeeping/transactions/trans_id/${this.$route.params.transId}`,
        config
      )
      this.loading = false
      this.transactions = response.data
      this.date = this.formatDate(trans.data[0].date)
      this.num = trans.data[0].num
      this.memo = trans.data[0].memo
      this.status = trans.data[0].status
      this.createdAt = moment(trans.data[0].createdAt).format('LLLL')
      this.updatedAt = moment(trans.data[0].updatedAt).format('LLLL')
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  watch: {
    async update () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        this.loading = true
        const response = await axios.get(`/api/bookkeeping/transaction-records/trans_id/${this.$route.params.transId}`)
        const trans = await axios.get(
          `/api/bookkeeping/transactions/trans_id/${this.$route.params.transId}`,
          config
        )
        this.loading = false
        this.transactions = response.data
        this.date = this.formatDate(trans.data[0].date)
        this.num = trans.data[0].num
        this.memo = trans.data[0].memo
        this.status = trans.data[0].status
        this.createdAt = moment(trans.data[0].createdAt).format('LLLL')
        this.updatedAt = moment(trans.data[0].updatedAt).format('LLLL')
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>

<style scoped></style>
