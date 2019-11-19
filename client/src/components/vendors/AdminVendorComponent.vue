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
              :items="formatVendorArray"
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
  name: 'AdminVendorComponent',
  data () {
    return {
      loading: false,
      vendorName: '',
      vendorBalance: [],
      vendorNames: [],
      headers: [
        { text: 'Vendors', value: 'name' },
        { text: 'Current Payable', align: 'right', value: 'balance' }
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
      const response = await axios.get(`/api/vendor/bookkeeper/balances/0`, config)
      const vendorNames = await axios.get('/api/vendor', config)
      this.vendorBalance = response.data
      this.vendorNames = vendorNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
    this.loading = false
  },
  computed: {
    ...mapState(['auth']),
    vendorArray () {
      // Create an array combining vendor name from vendor table and from accounts table
      const vendors = this.vendorNames.map(name => {
        const balance = this.vendorBalance.filter(vendor => {
          // eslint-disable-next-line eqeqeq
          return vendor.name.id == name.id
        })
        if (balance.length > 0) {
          name.balance = parseFloat(balance[0].balance)
        } else {
          name.balance = 0
        }
        return name
      })
      return vendors
    },
    formatVendorArray () {
      return this.vendorArray.map(vendor => {
        const formatBalance = parseFloat(vendor.balance) * (-1)
        vendor.balance = this.currency(parseFloat(formatBalance).toFixed(2))
        return vendor
      })
    },
    vendorAccount () {
      const vendorNames = this.vendorNames.map(vendor => {
        const sub = {
          name: vendor.name
        }
        return sub
      })
      return vendorNames
    }
  }
}
</script>
