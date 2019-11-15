<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-dialog
          persistent
          v-model="deleteDialog"
          width="400"
        >
          <v-card>
            <v-card-title>
            </v-card-title>
            <v-card-text>
              <span class="error--text subtitle-1">Are you sure you want to delete vendor?</span>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
              <v-btn color="error" text @click="deleteVendor">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="addDialog" max-width="400px">
          <v-card>
            <v-card-title>
              Add Vendor
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="vendorName" label="Name"></v-text-field>
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
                @click="addVendor">
                  Add
                </v-btn>
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
              :items="formatVendorArray"
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
  name: 'ManagerVendorComponent',
  data () {
    return {
      deleteDialog: false,
      selected: [],
      addDialog: false,
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
    },
    async addVendor () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const newVendorAccount = JSON.stringify({
        name: this.vendorName
      })
      try {
        await axios.post('/api/vendor', newVendorAccount, config)
        // Get data and update CIB in accounts table
        const response = await axios.get('/api/vendor', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response.data }
        })
        await axios.put('/api/vendor/update-account', sub, config)
        this.updated++
        this.addDialog = false
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    async deleteVendor () {
      const config = {
        data: {
          items: [...this.selectedId]
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        await axios.delete('/api/vendor', config)
        // Get data and update A/R customers in accounts table
        const response = await axios.get('/api/vendor', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response.data }
        })
        await axios.put('/api/vendor/update-account', sub, config)
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
      const response = await axios.get(`/api/vendor/bookkeeper/balances/${this.auth.user.BranchId}`, config)
      const vendorNames = await axios.get('/api/vendor', config)
      // Get data and update A/R customers in accounts table
      const response2 = await axios.get('/api/vendor', config)
      const sub = JSON.stringify({
        sub: { subaccounts: response2.data }
      })
      await axios.put('/api/vendor/update-account', sub, config)
      this.vendorBalance = response.data
      this.vendorNames = vendorNames.data
    } catch (e) {
      this.getError(e.response.data)
    }
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
        const response = await axios.get(`/api/vendor/bookkeeper/balances/${this.auth.user.BranchId}`, config)
        const vendorNames = await axios.get('/api/vendor', config)
        // Get data and update A/R customers in accounts table
        const response2 = await axios.get('/api/vendor', config)
        const sub = JSON.stringify({
          sub: { subaccounts: response2.data }
        })
        await axios.put('/api/vendor/update-account', sub, config)
        this.vendorBalance = response.data
        this.vendorNames = vendorNames.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>
