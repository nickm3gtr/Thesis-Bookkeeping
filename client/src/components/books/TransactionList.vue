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
                <v-btn dark color="blue" small class="mx-1"  @click="editItem(item)">
                  <v-icon small class="mr-2">edit</v-icon>
                </v-btn>
                <v-btn dark small color="red" class="mx-1" @click="clickDelete(item)">
                  <v-icon small>delete</v-icon>
                </v-btn>
                <v-dialog hide-overlay v-model="dialogDelete" width="500">
                  <v-card>
                    <v-toolbar color="red lighten-1" dark>
                      <v-toolbar-title>Delete</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <p class="subtitle-1 mt-5">Are you sure you want to delete?</p>
                    </v-card-text>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="primary" text @click="dialogDelete = false">Cancel</v-btn>
                      <v-btn color="red" text @click="deleteItem">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" bottom="bottom" color="red" :timeout="timeout">
          Deleted!
          <v-btn color="white" text @click="snackbar=false">Close</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'TransactionList',
  data () {
    return {
      dialogDelete: false,
      select: { id: 0, name: 'All' },
      books: [],
      search: '',
      transactions: [],
      loading: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'TransactionID', value: 'TransId' },
        { text: 'Memo', value: 'memo' },
        {
          text: 'Actions',
          value: 'action',
          align: 'center',
          sortable: false
        }
      ],
      itemToDelete: '',
      indexToDelete: '',
      timeout: 2000,
      snackbar: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async clear () {
      for (let i = 0; i < this.selected.length; i++) {
        const index = this.transactions.indexOf(this.selected[i])
        this.transactions.splice(index, 1)
      }
      const codes = this.selected.map(select => select.TransId)
      const deleteCode = JSON.stringify({ transId: codes })
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          },
          data: deleteCode
        }
        const response = await axios.delete(
          '/api/bookkeeping/transactions',
          config
        )
        console.log(response.data)
      } catch (e) {
        this.getError(e.response.data)
      }
      this.selected = []
      this.dialogDelete = false
    },
    clickDelete (item) {
      this.index = this.transactions.indexOf(item)
      this.itemToDelete = item
      this.dialogDelete = true
    },
    async deleteItem () {
      try {
        const response = await axios.delete(
          `/api/bookkeeping/transactions/${this.itemToDelete.TransId}`
        )
        console.log(response.data)
        this.transactions.splice(this.index, 1)
        this.dialogDelete = false
        this.snackbar = true
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    goToItem (item) {
      this.$router.push(`/bookkeeper/transactions/${item.TransId}`)
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
            '/api/bookkeeping/transactions',
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
            `/api/bookkeeping/transactions/${this.select.id}`,
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
        `/api/bookkeeping/transactions/${this.auth.user.Branch.id}`,
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
