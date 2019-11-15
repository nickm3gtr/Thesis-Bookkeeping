<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-dialog persistent v-model="addDialog" max-width="400px">
          <v-card>
            <v-card-title>
              Add Bank
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="bankName" label="Name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
                <v-btn
                color="primary" text
                @click="addDialog = false">
                  Close
                </v-btn>
                <v-btn
                color="primary" text
                @click="addBank">
                  Add
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          persistent
          v-model="deleteDialog"
          width="400"
        >
          <v-card>
            <v-card-title>
            </v-card-title>
            <v-card-text>
              <span class="error--text subtitle-1">Are you sure you want to delete Bank?</span>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
              <v-btn color="error" text @click="deleteBank">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card outlined class="my-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10"></v-col>
              <v-col cols="12" md="1">
                <v-btn
                  fab
                  small
                  color="primary"
                  @click="addDialog = true"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  :hidden="!hasSelected"
                  fab
                  small
                  color="error"
                  @click="deleteDialog = true"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              show-select
              v-model="selected"
              :headers="headers"
              :items="formatBankArray"
              :items-per-page="5"
              class="elevation-1"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import numeral from 'numeral'

export default {
  name: 'AdminBankComponent',
  data () {
    return {
      deleteDialog: false,
      selected: [],
      addDialog: false,
      bankName: '',
      bankBalance: [],
      bankNames: [],
      headers: [
        { text: 'Bank', value: 'name' },
        { text: 'Current Balance', align: 'right', value: 'balance' }
      ],
      updated: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    async addBank () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const newBankAccount = JSON.stringify({
        name: this.bankName
      })
      try {
        await axios.post('/api/bank', newBankAccount, config)
        // Get data and update CIB in accounts table
        const response = await axios.get('/api/bank', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response.data }
        })
        await axios.put('/api/bank/update-account', sub, config)
        this.updated++
        this.addDialog = false
        this.bankName = ''
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    async deleteBank () {
      const config = {
        data: {
          items: [...this.selectedId]
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        await axios.delete('/api/bank', config)
        // Get data and update CIB in accounts table
        const response = await axios.get('/api/bank', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response.data }
        })
        await axios.put('/api/bank/update-account', sub, config)
        this.updated++
        this.deleteDialog = false
      } catch (e) {
        this.getError(e.response.data)
        this.deleteDialog = false
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
      const response = await axios.get(`/api/bank/bookkeeper/balances/0`, config)
      const bankNames = await axios.get('/api/bank', config)
      // Get data and update A/R customers in accounts table
      const response2 = await axios.get('/api/bank', config)
      const sub = JSON.stringify({
        sub: { subaccounts: response2.data }
      })
      await axios.put('/api/bank/update-account', sub, config)
      this.bankBalance = response.data
      this.bankNames = bankNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  computed: {
    ...mapState(['auth']),
    bankArray () {
      // Create an array combining bank name from bank table and from accounts table
      const banks = this.bankNames.map(name => {
        const balance = this.bankBalance.filter(bank => {
          // eslint-disable-next-line eqeqeq
          return bank.name.id == name.id
        })
        if (balance.length > 0) {
          name.balance = parseFloat(balance[0].balance)
        } else {
          name.balance = 0
        }
        return name
      })
      return banks
    },
    formatBankArray () {
      return this.bankArray.map(bank => {
        bank.balance = this.currency(parseFloat(bank.balance).toFixed(2))
        return bank
      })
    },
    bankAccount () {
      const bankNames = this.bankNames.map(bank => {
        const sub = {
          name: bank.name
        }
        return sub
      })
      return bankNames
    },
    selectedId () {
      return this.selected.map(item => {
        const id = item.id
        return id
      })
    },
    hasSelected () {
      return this.selected.length > 0
    }
  },
  watch: {
    async updated () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const response = await axios.get(`/api/bank/bookkeeper/balances/0`, config)
        const bankNames = await axios.get('/api/bank', config)
        // Get data and update A/R customers in accounts table
        const response2 = await axios.get('/api/bank', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response2.data }
        })
        await axios.put('/api/bank/update-account', sub, config)
        this.bankBalance = response.data
        this.bankNames = bankNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>
