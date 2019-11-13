<template>
  <div class="chart-of-account">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-title>
            <v-col cols="12" md="3"></v-col>
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
              <v-btn fab small color="primary" @click="addDialog = true">
                <v-icon>add</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn fab small dark color="orange darken-2" @click="deactivateDialog = true">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn fab small color="error" @click="deleteDialog = true">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-col>
          </v-card-title>
          <v-dialog
            persistent
            v-model="deleteDialog"
            width="400"
          >
            <v-card>
              <v-card-title>
                Are you sure you want to delete selected accounts?
              </v-card-title>
              <v-card-text>
                <span class="error--text subtitle-1">Deleting these accounts may affect your financial statements!</span>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
                <v-btn color="error" text @click="deleteAccount">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            persistent
            v-model="deactivateDialog"
            width="400"
          >
            <v-card>
              <v-card-title>
                Are you sure you want to deactivate selected accounts?
              </v-card-title>
              <v-card-text>
                <span class="error--text subtitle-1">Deactivate accounts</span>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
                <v-btn color="error" text @click="deactivateAccount">Proceed</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
              persistent
              v-model="addDialog"
              width="600"
            >
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
                        label="Select Type"
                        return-object
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-combobox
                        v-model="selectedSubType"
                        :items="filterSubTypes"
                        item-text="name"
                        label="Select SubType"
                        return-object
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-text-field v-model="accountName" label="Account Name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn color="blue darken-1" text @click="addDialog = false">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="saveAccount">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          <v-card-text>
            <v-data-table
              show-select
              v-model="selected"
              dense
              item-key="id"
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
        color="primary"
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
      selected: [],
      addDialog: false,
      deleteDialog: false,
      deactivateDialog: false,
      search: '',
      accountName: '',
      accounts: [],
      selectedType: '',
      types: [],
      subType: [],
      selectedSubType: '',
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
    async saveAccount () {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      const newAccount = {
        name: this.accountName,
        status: 'active',
        SubTypeId: this.selectedSubType.id
      }
      try {
        await axios.post('/api/accounts', newAccount, config)
        this.addDialog = false
        this.update++
        this.selectedType = ''
        this.selectedSubType = ''
        this.accountName = ''
        this.snackbar = true
      } catch (e) {
        this.getError(e.response.data)
        this.addDialog = false
      }
    },
    async deleteAccount () {
      const config = {
        data: {
          items: [...this.selectedId]
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        await axios.delete('/api/accounts', config)
        this.update++
        this.deleteDialog = false
      } catch (e) {
        this.getError(e.response.data)
        this.deleteDialog = false
      }
    },
    async deactivateAccount () {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      const items = {
        items: [...this.selectedId]
      }
      try {
        await axios.put('/api/accounts', items, config)
        this.update++
        this.deactivateDialog = false
      } catch (e) {
        this.getError(e.response.data)
        this.deactivateDialog = false
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
    },
    selectedId () {
      return this.selected.map(item => {
        const id = item.id
        return id
      })
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
}
</script>

<style scoped>
  .toolbar {
    background-color: #ffffff;
  }
</style>
