<template>
  <div class="chart-of-account">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6">
          <v-card-title>
            <v-col cols="12" md="6">
            </v-col>
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
          </v-card-title>
          <v-card-text>
            <v-data-table
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'ChartOfAccount',
  data () {
    return {
      search: '',
      accounts: [],
      selectedType: '',
      loading: false,
      headers: [
        { text: 'Account Name', value: 'name' },
        { text: 'Account Subtype', value: 'SubType.name' },
        { text: 'Account Type', value: 'SubType.Type.name' }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
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
      this.accounts = response.data
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
