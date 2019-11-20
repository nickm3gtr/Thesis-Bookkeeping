<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-card outlined class="my-6">
          <v-card-title>
          </v-card-title>
          <v-card-text>
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
  name: 'VendorProfileComponent',
  data () {
    return {
      name: '',
      contactPerson: '',
      address: '',
      email: '',
      number: ''
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      const response = await axios.get(`/api/vendor/${this.$route.params.id}`, config)
      const customer = response.data
      this.name = customer[0].name
      this.contactPerson = customer[0].contactPerson
      this.address = customer[0].address
      this.email = customer[0].email
      this.number = customer[0].number
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>
