<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-card outlined class="my-6 pb-12">
          <v-card-title>
          </v-card-title>
          <div class="text-center">
            <v-progress-circular
              v-if="loading === true"
              size="90"
              width="10"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <v-card-text v-if="loading === false">
            <v-row>
              <v-col cols="12" md="8">
                <p>Company Name: {{name}}</p>
                <p>Contact Person: {{contactPerson}}</p>
                <p>Address: {{address}}</p>
                <p>Email: {{email}}</p>
                <p>Number: {{number}}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'CustomerProfileComponent',
  data () {
    return {
      name: '',
      contactPerson: '',
      address: '',
      email: '',
      number: '',
      loading: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
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
      const response = await axios.get(`/api/customer/${this.$route.params.id}`, config)
      const customer = response.data
      this.name = customer[0].name
      this.contactPerson = customer[0].contactPerson
      this.address = customer[0].address
      this.email = customer[0].email
      this.number = customer[0].number
      this.loading = false
    } catch (e) {
      this.getError(e.response.data)
      this.loading = false
    }
  }
}
</script>
