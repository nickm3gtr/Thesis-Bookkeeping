<template>
  <div class="chart-of-account">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-title>
            <v-col cols="12" md="12">
              <span class="title font-weight-light">Chart of Accounts List</span>
            </v-col>
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                v-model="search"
                append-icon="search"
                label="Filter accounts"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <!--Add chart of account dialog-->
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-data-table
              dense
              item-key="code"
              :headers="headers"
              :items="accounts"
              :items-per-page="15"
              :search="search"
              :loading="loading"
              loading-text="Loading..."
              class="elevation-3"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="text-center">
      <v-snackbar
        v-model="snackbar"
        bottom="bottom"
        color="green"
        :timeout="timeout"
      >
       Account added!
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'ChartOfAccount',
  data () {
    return {
      addDialog: false,
      search: '',
      accounts: [],
      loading: false,
      headers: [
        { text: 'Account Name', value: 'name' },
        { text: 'Account Subtype', value: 'SubType.name' },
        { text: 'Account Type', value: 'SubType.Type.name' }
      ],
      snackbar: false,
      timeout: 2000,
      update: 0
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
    filterSubTypes () {
      if (this.selectedType === '' || this.selectedType === null) {
        return this.subType
      } else {
        return this.subType.filter(item => {
          return item.TypeId === this.selectedType.id
        })
      }
    }
  },
  async mounted () {
    const config = {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      this.loading = true
      const response = await axios.get('/api/charts', config)
      const types = await axios.get('/api/accounts/types', config)
      const subType = await axios.get('/api/accounts/subtypes', config)
      this.accounts = response.data
      this.types = types.data
      this.subType = subType.data
      this.loading = false
    } catch (error) {
      this.loading = false
      console.log(error)
    }
  }
}
</script>

<style scoped>
  .toolbar {
    background-color: #ffffff;
  }
</style>
