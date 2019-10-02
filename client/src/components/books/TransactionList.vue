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
              <v-col cols="12" md="1"></v-col>
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
              <v-col cols="12" md="1">
                <v-dialog v-model="dialogDelete" width="500">
                  <template v-slot:activator="{ on: deleteDialog }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          color="red"
                          v-on="{ ...deleteDialog, ...tooltip }"
                          dark
                          fab
                          small
                          class="mt-4"
                          :class="{ 'disable-events': deleteItems }"
                        >
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
                      <p class="subtitle-1 mt-5">
                        Are you sure you want to delete?
                      </p>
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
            </v-row>
            <v-data-table
              v-model="selected"
              show-select
              item-key="TransId"
              :headers="headers"
              :items="formatTransactions"
              :items-per-page="5"
              :search="search"
              :loading="loading"
              loading-text="Loading..."
              class="elevation-3"
            >
              <template slot="{ item, select }" slot-scope="props">
                <router-link
                  tag="tr"
                  :to="{
                    name: 'transactions-filter',
                    params: {
                      transId: `${props.item.TransId}`
                    }
                  }"
                >
                  <td>
                    <v-checkbox input-value = "select.props.value primary"
                    hide-details @click.stop= "select.on.input" />
                  </td>
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
      selected: [],
      dialogDelete: false,
      select: { id: 0, name: 'All' },
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
        const response = await axios.delete('/api/bookkeeping/transactions', config)
        console.log(response.data)
      } catch (e) {
        this.getError(e.response.data)
      }
      this.selected = []
      this.dialogDelete = false
    }
  },
  computed: {
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
        '/api/bookkeeping/transactions',
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
