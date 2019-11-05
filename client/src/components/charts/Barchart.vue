<script>
import { Bar } from 'vue-chartjs'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Barchart',
  extends: Bar,
  data () {
    return {
      loading: false,
      year: new Date().getFullYear(),
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
    ...mapState(['auth'])
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      const response = await axios.get(`/api/graphs/sales/${this.auth.user.BranchId}/${this.year}`, config)
      this.sales = response.data
    } catch (e) {
    }
    const renderChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Sales',
          data: [
            this.formatBalance(this.sales[0].january),
            this.formatBalance(this.sales[0].february),
            this.formatBalance(this.sales[0].march),
            this.formatBalance(this.sales[0].april),
            this.formatBalance(this.sales[0].may),
            this.formatBalance(this.sales[0].june),
            this.formatBalance(this.sales[0].july),
            this.formatBalance(this.sales[0].august),
            this.formatBalance(this.sales[0].september),
            this.formatBalance(this.sales[0].october),
            this.formatBalance(this.sales[0].november),
            this.formatBalance(this.sales[0].december)
          ],
          backgroundColor: '#039be5'
        }
      ]
    }
    const options = {
      scales: {
        xAxes: [{
          barPercentage: 0.5,
          gridLines: {
            offsetGridLines: true
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    this.renderChart(renderChartData, options)
  }
}
</script>

<style scoped>

</style>
