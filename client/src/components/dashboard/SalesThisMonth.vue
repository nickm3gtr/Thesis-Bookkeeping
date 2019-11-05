<template>
  <div>
    <v-card dark color="primary"
      min-height="150"
    >
      <v-card-title>
        <span class="title font-weight-medium">Sales this month</span>
      </v-card-title>
      <v-card-text>
        <p v-if="loading === true"></p>
        <p v-else class="text-center headline font-weight-medium">&#8369;{{currency(formatSales)}}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'

export default {
  name: 'SalesThisMonth',
  data () {
    return {
      sales: '',
      date: new Date(),
      loading: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    currency (value) {
      return numeral(value).format('0,0.00')
    }
  },
  computed: {
    ...mapState(['auth']),
    formatSales () {
      return parseFloat(this.sales) * -1
    },
    formatDate () {
      return moment(this.date).format('M')
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
      this.loading = true
      const response = await axios.get(`/api/dashboard/sales/${this.auth.user.BranchId}/${this.formatDate}`, config)
      if (response.data.length < 1) {
        this.sales = 0
      } else {
        this.sales = response.data[0].balance
      }
      this.loading = false
    } catch (e) {
      this.getError(e.response.data)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
