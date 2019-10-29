<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-title>
            <v-col cols="12" md="12">
              <span class="title font-weight-light">Transactions List</span>
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-combobox
                  v-model="select"
                  :items="prependBook"
                  item-text="name"
                  label="Select Book"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="2"></v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
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
              <template v-slot:item.action="{ item }">
                <v-btn dark small color="green" class="mx-1" @click="goToItem(item)">
                  <v-icon small>search</v-icon>
                </v-btn>
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
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'AdminTransactionList',
  data () {
    return {
      select: { id: 0, name: 'All' },
      books: [],
      search: '',
      transactions: [],
      loading: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'TransactionID', value: 'id' },
        { text: 'Branch', value: 'branchName' },
        { text: 'Description', value: 'memo' },
        {
          text: 'Action',
          value: 'action',
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    goToItem (item) {
      this.$router.push(`/admin/transactions/${item.id}`)
    }
  },
  computed: {
    ...mapState(['auth']),
    prependBook () {
      const prependBook = [{ id: 0, name: 'All' }, ...this.books]
      return prependBook
    },
    formatTransactions () {
      return this.transactions.map(transaction => {
        transaction.date = moment(transaction.date).format('MMM DD')
        return transaction
      })
    },
    deleteItems () {
      return this.selected <= 0
    }
  },
  watch: {
    async select () {
      if (this.select.id === 0) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
        try {
          this.loading = true
          const response = await axios.get(
            `/api/transactions/admin-transactions`,
            config
          )
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
          const response = await axios.get(
            `/api/transactions/admin-transactions/book/${this.select.id}`,
            config
          )
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
      const transactions = await axios.get(
        `/api/transactions/admin-transactions`,
        config
      )
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
.disable-events {
  pointer-events: none;
  opacity: 0.6;
}
</style>
