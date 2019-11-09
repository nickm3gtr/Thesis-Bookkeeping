<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-dialog v-model="addDialog" max-width="400px">
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
        <v-card outlined class="my-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10"></v-col>
              <v-col cols="12" md="2">
                <v-btn
                  small
                  dark
                  color="primary"
                  @click="addDialog = true"
                >
                  Add
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="bankArray"
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
import { mapActions } from 'vuex'

export default {
  name: 'BankComponent',
  data () {
    return {
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
      const response = await axios.get('/api/bank/balances', config)
      const bankNames = await axios.get('/api/bank', config)
      this.bankBalance = response.data
      this.bankNames = bankNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  computed: {
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
    bankAccount () {
      const bankNames = this.bankNames.map(bank => {
        const sub = {
          name: bank.name
        }
        return sub
      })
      return bankNames
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
        const response = await axios.get('/api/bank/balances', config)
        const bankNames = await axios.get('/api/bank', config)
        this.bankBalance = response.data
        this.bankNames = bankNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>
