<script>
import { Doughnut } from 'vue-chartjs'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'AdminDoughnutChart',
  extends: Doughnut,
  data () {
    return {
      loading: false,
      date: new Date(),
      sales: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    formatBalance (value) {
      const num = (value * -1)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }
  },
  computed: {
    ...mapState(['auth']),
    formatDate () {
      return moment(this.date).format('M')
    },
    salesLabel () {
      return this.sales.map(item => {
        return item.branchName
      })
    },
    salesData () {
      return this.sales.map(item => {
        return this.formatBalance(item.balance)
      })
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
      const response = await axios.get(`/api/dashboard/admin/sales/by-branch/${this.formatDate}`, config)
      this.sales = response.data
    } catch (e) {
      this.getError(e.response.data)
    }
    const renderChartData = {
      labels: this.salesLabel,
      datasets: [
        {
          label: 'Sales',
          data: this.salesData,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#fe5722', '#00e578']
        }
      ]
    }
    const options = {
      maintainAspectRatio: false
    }
    this.renderChart(renderChartData, options)
  }
}
</script>
