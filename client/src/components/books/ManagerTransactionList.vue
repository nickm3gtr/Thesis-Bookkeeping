<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
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
              <v-col cols="12" md="1">
                <v-btn :hidden="!isSelected" class="mt-4" fab small color="primary" @click="validateAccount">
                  <v-icon>check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" md="3">
                <v-checkbox v-model="validated" class="mx-2" label="validated"></v-checkbox>
              </v-col>
              <v-col cols="6" md="3">
                <v-checkbox v-model="unvalidated" class="mx-2" label="unvalidated"></v-checkbox>
              </v-col>
            </v-row>
            <v-data-table
              v-model="selected"
              show-select
              item-key="id"
              :headers="headers"
              :items="filterValidated"
              :items-per-page="5"
              :search="search"
              :loading="loading"
              loading-text="Loading..."
              class="elevation-3"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td>
                    <v-checkbox
                      v-model="props.selected"
                      :disabled="!props.selected && selected.length != 0"
                      :indeterminate="!props.selected && selected.length != 0"
                    ></v-checkbox>
                  </td>
                  <td>
                    {{props.item.id}}
                  </td>
                </tr>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn dark small color="green" class="mx-1" @click="route(item.id)">
                  <v-icon small>search</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" bottom="bottom" color="error" :timeout="timeout">
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
  name: 'ManagerTransactionList',
  data () {
    return {
      validated: true,
      unvalidated: false,
      selected: [],
      select: { id: 0, name: 'All' },
      books: [],
      search: '',
      transactions: [],
      loading: false,
      dialog: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'TransactionID', value: 'id' },
        { text: 'Number', value: 'num' },
        { text: 'Description', value: 'memo' },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'action'
        }
      ],
      timeout: 2000,
      snackbar: false,
      itemToDelete: '',
      update: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    route (id) {
      this.$router.push(`/admin/transactions/${id}`)
    },
    prepareDelete (item) {
      this.itemToDelete = item
      this.dialog = true
    },
    goToItem (item) {
      this.$router.push(`/bookkeeper/transactions/${item.id}`, () => {})
    },
    async validateAccount () {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      const items = {
        items: [...this.selectedId]
      }
      try {
        await axios.put('/api/transactions/validated', items, config)
        this.update++
        this.selected = []
      } catch (e) {
        this.getError(e.response.data)
      }
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
    filterValidated () {
      if (this.validated && !this.unvalidated) {
        return this.formatTransactions.filter(transaction => transaction.validated === 'validated')
      } else if (!this.validated && this.unvalidated) {
        return this.formatTransactions.filter(transaction => transaction.validated === 'unvalidated')
      } else if (this.validated && this.unvalidated) {
        return this.formatTransactions
      } else {
        return []
      }
    },
    isSelected () {
      return this.selected.length > 0
    },
    selectedId () {
      return this.selected.map(item => {
        const id = item.id
        return id
      })
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
            `/api/bookkeeping/transactions/branch/${this.auth.user.BranchId}`,
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
            `/api/bookkeeping/transactions/book/${this.auth.user.BranchId}/${this.select.id}`,
            config
          )
          this.loading = false
          this.transactions = response.data
        } catch (e) {
          this.loading = false
          this.getError(e.response.data)
        }
      }
    },
    async update () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        this.loading = true
        const transactions = await axios.get(
          `/api/bookkeeping/transactions/branch/${this.auth.user.BranchId}`,
          config
        )
        this.loading = false
        this.transactions = transactions.data
      } catch (e) {
        this.getError(e.response.data)
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
        `/api/bookkeeping/transactions/branch/${this.auth.user.BranchId}`,
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
