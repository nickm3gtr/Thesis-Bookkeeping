<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-dialog v-model="addDialog" max-width="400px">
          <v-card>
            <v-card-title>
              Add Customer
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="customerName" label="Name"></v-text-field>
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
                @click="addCustomer">
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
              :items="formatCustomerArray"
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
  name: 'CustomerComponent',
  data () {
    return {
      addDialog: false,
      customerName: '',
      customerBalance: [],
      customerNames: [],
      headers: [
        { text: 'Customers', value: 'name' },
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
    async addCustomer () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const newCustomerAccount = JSON.stringify({
        name: this.customerName
      })
      try {
        await axios.post('/api/customer', newCustomerAccount, config)
        // Get data and update A/R customers in accounts table
        const response = await axios.get('/api/customer', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response.data }
        })
        await axios.put('/api/customer/update-account', sub, config)
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
      const response = await axios.get(`/api/customer/bookkeeper/balances/${this.auth.user.BranchId}`, config)
      const customerNames = await axios.get('/api/customer', config)
      this.customerBalance = response.data
      this.customerNames = customerNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  computed: {
    ...mapState(['auth']),
    customerArray () {
      // Create an array combining customer name from customer table and from accounts table
      const customers = this.customerNames.map(name => {
        const balance = this.customerBalance.filter(customer => {
          // eslint-disable-next-line eqeqeq
          return customer.name.id == name.id
        })
        if (balance.length > 0) {
          name.balance = parseFloat(balance[0].balance)
        } else {
          name.balance = 0
        }
        return name
      })
      return customers
    },
    formatCustomerArray () {
      return this.customerArray.map(customer => {
        customer.balance = this.currency(parseFloat(customer.balance).toFixed(2))
        return customer
      })
    },
    customerAccount () {
      const customerNames = this.customerNames.map(customer => {
        const sub = {
          name: customer.name
        }
        return sub
      })
      return customerNames
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
        const response = await axios.get(`/api/customer/bookkeeper/balances/${this.auth.user.BranchId}`, config)
        const customerNames = await axios.get('/api/customer', config)
        this.customerBalance = response.data
        this.customerNames = customerNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>
