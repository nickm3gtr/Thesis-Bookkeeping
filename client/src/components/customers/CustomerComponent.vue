<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10"></v-col>
              <v-col cols="12" md="2">
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="formatCustomerArray"
              :items-per-page="5"
              class="elevation-1"
              :loading="loading"
              loading-text="Loading..."
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
import numeral from 'numeral'

export default {
  name: 'CustomerComponent',
  data () {
    return {
      loading: false,
      customerName: '',
      customerBalance: [],
      customerNames: [],
      headers: [
        { text: 'Customers', value: 'name' },
        { text: 'Current Receivable', align: 'right', value: 'balance' },
        {
          text: 'Actions',
          value: 'action',
          align: 'center',
          sortable: false
        }
      ],
      updated: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    goToItem (item) {
      this.$router.push(`/manager/customer/${item.id}`)
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
      const response = await axios.get(`/api/customer/bookkeeper/balances/${this.auth.user.BranchId}`, config)
      const customerNames = await axios.get('/api/customer', config)
      this.customerBalance = response.data
      this.customerNames = customerNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
    this.loading = false
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
      this.loading = true
      try {
        const response = await axios.get(`/api/customer/bookkeeper/balances/${this.auth.user.BranchId}`, config)
        const customerNames = await axios.get('/api/customer', config)
        this.customerBalance = response.data
        this.customerNames = customerNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
      this.loading = false
    }
  }
}
</script>
