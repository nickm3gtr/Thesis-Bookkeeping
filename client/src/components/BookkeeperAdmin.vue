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
                          :items="items"
                          item-text="branch"
                          value="branchId"
                          label="Select Branch"
                        ></v-combobox>
                      </v-col>
                    </v-card-text>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="blue darken-1" @click="dialog = false" text>Close</v-btn>
                      <v-btn color="blue darken-1" text @click="emit">Save</v-btn>
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
  name: 'BookkeeperAdmin',
  data () {
    return {
      name: '',
      password: '',
      branchId: '',
      select: '',
      dialog: false,
      items: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Username', value: 'name' },
        { text: 'Branch', value: 'branch' }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    emit () {
      this.$emit('abc', this.select.branchid)
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
      const response = await axios.get('/api/bookkeepers/all-bookkeepers', config)
      this.items = response.data
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>

<style scoped>

</style>
