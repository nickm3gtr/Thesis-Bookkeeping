<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="9">
                <p>Bookkeeper Accounts</p>
              </v-col>
              <v-col cols="12" md="3">
                <v-dialog persistent v-model="dialog" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn depressed dark class="mr-2" color="primary"
                      v-on="on"
                    >Add Account</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="title">Add Bookkeeper</span>
                    </v-card-title>
                    <v-card-text>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="name" label="Username"></v-text-field>
                        <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-combobox
                          v-model="select"
                          :items="branches"
                          item-text="branchName"
                          value="branchId"
                          label="Select Branch"
                        ></v-combobox>
                      </v-col>
                    </v-card-text>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="blue darken-1" @click="dialog = false" text>Close</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="loading"
            >
              <template v-slot:item.action="{ item }">
                <v-dialog
                  v-model="deleteDialog" max-width="600px"
                >
                  <template v-slot:activator="{ on: dialog }">
                    <v-icon
                      small
                      v-on="{ ...dialog }"
                    >
                      delete
                    </v-icon>
                  </template>
                  <v-card>
                    <v-card-title
                      class="headline grey lighten-2"
                      primary-title
                    >
                      Delete Account
                    </v-card-title>
                    <v-card-text>
                      <p class="subtitle-1">Are you sure you want to delete?</p>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn
                        color="primary"
                        text
                        @click="deleteDialog = false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="deleteItem(item)"
                      >
                        Okay
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
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
        {{ msg }}
        <v-btn
          color="white"
          text
          @click="closeSnackBar"
        >
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'BookkeeperAdmin',
  data () {
    return {
      name: '',
      password: '',
      branchId: '',
      select: '',
      dialog: false,
      deleteDialog: false,
      snackbar: false,
      timeout: 0,
      saved: 1,
      loading: false,
      msg: '',
      items: [],
      branches: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Username', value: 'name' },
        { text: 'Branch', value: 'branch' },
        { text: 'Actions', align: 'center', value: 'action', sortable: false }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async save () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const newUser = JSON.stringify({
        userName: this.name,
        password: this.password,
        account: 'bookkeeper',
        BranchId: this.select.id
      })
      try {
        const response = await axios.post('http://localhost:5000/api/bookkeepers', newUser, config)
        const savedTransaction = response.data
        if (!savedTransaction) this.getError('Failed')
        this.msg = 'Saved!'
        this.saved++
        this.snackbar = true
        this.dialog = false
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    async deleteItem (item) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const response = await axios.delete(`/api/bookkeepers/${item.id}`, config)
        this.msg = response.data.msg
        this.deleteDialog = false
        this.snackbar = true
        this.saved++
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    closeSnackBar () {
      this.snackbar = false
      this.clear()
    },
    clear () {
      this.name = ''
      this.password = ''
      this.select = ''
      this.msg = ''
    }
  },
  async mounted () {
    this.loading = true
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      const response = await axios.get('/api/bookkeepers/all-bookkeepers', config)
      const branches = await axios.get('/api/admin/branches', config)
      this.loading = false
      this.branches = branches.data
      this.items = response.data
    } catch (e) {
      this.loading = false
      this.getError(e.response.data)
    }
  },
  watch: {
    async saved () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        this.loading = true
        const response = await axios.get('/api/bookkeepers/all-bookkeepers', config)
        this.loading = false
        this.items = response.data
      } catch (e) {
        this.loading = false
        this.getError(e.response.data)
      }
    }
  }
}
</script>

<style scoped>

</style>
