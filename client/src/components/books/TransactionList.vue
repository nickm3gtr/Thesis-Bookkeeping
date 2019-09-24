<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-combobox
                  v-model="selected"
                  :items="prependBook"
                  item-text="name"
                  label="Select Book"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="2"></v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  solo
                  v-model="search"
                  append-icon="search"
                  label="Filter transactions"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              item-key="TransId"
              :headers="headers"
              :items="formatTransactions"
              :items-per-page="5"
              :search="search"
              :loading="loading"
              loading-text="Loading..."
              class="elevation-3"
            >
              <template slot="item" slot-scope="props">
                <router-link tag="tr" :to="{
                    name: 'transactions-filter',
                    params: {
                      transId: `${props.item.TransId}`
                    }
                  }">
                  <td>{{ props.item.date }}</td>
                  <td>{{ props.item.TransId }}</td>
                  <td>{{ props.item.num }}</td>
                  <td>{{ props.item.memo }}</td>
                </router-link>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'TransactionList',
  data () {
    return {
      selected: { id: 0, name: 'All' },
      books: [],
      search: '',
      transactions: [],
      loading: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'TransactionID', value: 'TransId' },
        { text: 'Num', value: 'num' },
        { text: 'Memo', value: 'memo' }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
    prependBook () {
      const prependBook = [ { id: 0, name: 'All' }, ...this.books ]
      return prependBook
    },
    formatTransactions () {
      return this.transactions.map(transaction => {
        transaction.date = moment(transaction.date).format('MMM DD')
        return transaction
      })
    }
  },
  watch: {
    async selected () {
      if (this.selected.id === 0) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
        try {
          this.loading = true
          const response = await axios.get('/api/bookkeeping/transactions', config)
          this.loading = false
          this.transactions = response.data
        } catch (e) {
          this.loading = false
          this.getError(e.response.data)
        }
      } else {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
        try {
          this.loading = true
          const response = await axios.get(`/api/bookkeeping/transactions/${this.selected.id}`, config)
          this.loading = false
          this.transactions = response.data
        } catch (e) {
          this.loading = false
          this.getError(e.response.data)
        }
      }
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
      const response = await axios.get('/api/books', config)
      this.loading = true
      const transactions = await axios.get('/api/bookkeeping/transactions', config)
      this.books = response.data
      this.loading = false
      this.transactions = transactions.data
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>

<style scoped>
  tr:hover {
    cursor: pointer;
  }
</style>
