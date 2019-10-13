<template>
  <div>
    <v-card dark color="success"
      min-height="150"
    >
      <v-card-title>
        <span class="title font-weight-medium">Transactions Recorded</span>
      </v-card-title>
      <v-card-text>
        <p v-if="loading === true"></p>
        <p v-else class="text-center headline font-weight-medium">{{count}}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminTransactionsRecorded',
  data () {
    return {
      count: '',
      loading: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
    ...mapState(['auth'])
  },
  async mounted () {
    try {
      this.loading = true
      const response = await axios.get('/api/dashboard/admin/transactions-recorded')
      this.count = response.data[0].count
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
