<script>
import { Bar } from 'vue-chartjs'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ExpenseBarChart',
  extends: Bar,
  data () {
    return {
      loading: false,
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: new Date().toISOString().substr(0, 10),
      sales: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
    ...mapState(['auth']),
    filterExpenses () {
      return this.sales.map(sales => {
        sales.balance = Math.abs(sales.balance)
        sales.balance = parseFloat(Math.round(sales.balance * 100) / 100).toFixed(2)
        return sales.balance
      })
    },
    filterMonth () {
      return this.sales.map(sales => {
        sales.month = moment().month(sales.month).format('MMM')
        return sales.month
      })
    }
  },
  async mounted () {
    try {
      const response = await axios.get(`/api/graphs/expenses/${this.auth.user.BranchId}/${this.startDate}/${this.endDate}`)
      this.sales = response.data
    } catch (e) {
      this.getError(e.response.data)
    }
    const renderChartData = {
      labels: this.filterMonth,
      datasets: [
        {
          label: 'Expenses',
          data: this.filterExpenses,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    }
    const options = {
      scales: {
        xAxes: [{
          barPercentage: 0.5,
          barThickness: 40,
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
