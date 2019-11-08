<template>
  <div>
    <v-layout>
      <v-flex sm12 md6 offset-md3>
        <v-card outlined class="my-6">
          <v-card-text>
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
      bankBalance: [],
      bankNames: [],
      headers: [
        { text: 'Bank', value: 'name' },
        { text: 'Current Balance', align: 'right', value: 'balance' }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
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
      const banks = this.bankNames.map(name => {
        const balance = this.bankBalance.filter(bank => {
          return bank.name.name === name.name
        })
        if (balance.length > 0) {
          name.balance = parseFloat(balance[0].balance)
        } else {
          name.balance = 0
        }
        return name
      })
      return banks
    }
  }
}
</script>
