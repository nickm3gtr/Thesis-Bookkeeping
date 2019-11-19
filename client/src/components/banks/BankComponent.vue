<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-card outlined class="my-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10"></v-col>
              <v-col cols="12" md="2">
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="formatBankArray"
              :items-per-page="5"
              class="elevation-1"
              :loading="loading"
              loading-text="Loading..."
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
  name: 'BankComponent',
  data () {
    return {
      loading: false,
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
    }
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    this.loading = true
    try {
      const response = await axios.get(`/api/bank/bookkeeper/balances/${this.auth.user.BranchId}`, config)
      const bankNames = await axios.get('/api/bank', config)
      this.bankBalance = response.data
      this.bankNames = bankNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
    this.loading = false
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
      this.loading = true
      try {
        const response = await axios.get(`/api/bank/bookkeeper/balances/${this.auth.user.BranchId}`, config)
        const bankNames = await axios.get('/api/bank', config)
        this.bankBalance = response.data
        this.bankNames = bankNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
      this.loading = false
    }
  }
}
</script>
