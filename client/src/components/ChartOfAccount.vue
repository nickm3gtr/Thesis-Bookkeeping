<template>
  <div class="chart-of-account">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined elevation="10">
          <v-toolbar color="light-blue darken-3" dark>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
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
              <v-dialog persistent v-model="addDialog" max-width="600px">
                <template v-slot:activator="{ on: addDialog }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn color="primary" dark fab small class="mt-4" v-on="{ ...addDialog, ...tooltip }">
                        <v-icon>note_add</v-icon>
                      </v-btn>
                    </template>
                    <span>Add</span>
                  </v-tooltip>
                </template>
                <!--Add chart of account card-->
                <v-card>
                  <v-card-title>
                    Add Account
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-combobox
                          v-model="selectedType"
                          :items="types"
                          item-text="name"
                          label="Select Account Type"
                          return-object
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-combobox
                          v-model="selectedSubType"
                          :items="filterSubTypes"
                          item-text="name"
                          label="Select Account SubType"
                          return-object
                        ></v-combobox>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="accountName" label="Account Name"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                      <v-btn color="blue darken-1" @click="addDialog=false" text>Close</v-btn>
                      <v-btn color="blue darken-1"
                      text
                      @click="addAccount">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
      types: [],
      subTypes: [],
      accounts: [],
      selectedType: '',
      selectedSubType: '',
      accountName: '',
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
    ...mapActions('errors', ['getError']),
    async addAccount () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const newAccount = JSON.stringify({
        name: this.accountName,
        SubTypeId: this.selectedSubType.id
      })
      try {
        await axios.post('/api/accounts', newAccount, config)
        this.snackbar = true
        this.update++
        this.addDialog = false
      } catch (e) {
        this.getError(e.response.data)
        this.addDialog = false
      }
    }
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
  watch: {
    async update () {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        this.loading = true
        const response = await axios.get('/api/charts', config)
        const types = await axios.get('/api/accounts/types')
        const subType = await axios.get('/api/accounts/subtypes')
        this.accounts = response.data
        this.types = types.data
        this.subType = subType.data
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
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
      const types = await axios.get('/api/accounts/types')
      const subType = await axios.get('/api/accounts/subtypes')
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

<style scoped></style>
