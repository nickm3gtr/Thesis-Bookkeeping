<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6" min-height="400">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12">
                <span class="title font-weight-light">Generate Balance Sheet</span>
              </v-col>
              <v-col cols="12" md="3">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Choose Date"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    v-model="date"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="selectedBranch"
                  :items="branches"
                  item-text="branchName"
                  label="Select Branch"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6" class="mt-3">
                <v-btn dark color="primary" class="mx-2" @click="generate"
                >Generate</v-btn
                >
                <v-btn dark color="success" class="mx-2" @click="pdf"
                >Download PDF</v-btn
                >
              </v-col>
            </v-row>
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
          <div :hidden="hidden" id="content" v-if="loading === false">
            <v-card-text>
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span
                      v-if="auth.user === null || auth.user.account == 'admin'"
                      class="headline"
                    >{{ selectedBranch.branchName }}</span>
                    <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-1">Balance Sheet</span></p>
                  <p><span class="subtitle-2">As of {{ formatDate }}</span></p>
                </div>
              </v-flex>
              <hr>
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Current Assets</span>
              </v-row>
              <BalanceSheetComponent :accounts="filterItems(11000)"
                             :total="totalBalance(11000)"
                             :msg="totalMsg('Total Current Assets')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Non Current Assets</span>
              </v-row>
              <BalanceSheetComponent :accounts="filterItems(13000)"
                             :total="totalBalance(13000)"
                             :msg="totalMsg('Total Non Current Assets')"
              />
              <v-row class="ml-4 mb-4">
                <v-col cols="12" md="5">
                  <div v-if="totalAssets <= 0">
                    <span class="font-weight-bold red--text text--darken-3">
                      Total Assets
                    </span>
                  </div>
                  <div v-else>
                    <span class="font-weight-bold blue--text text--darken-3">
                      Total Assets
                    </span>
                  </div>
                </v-col>
                <v-col cols="12" md="3"></v-col>
                <v-col cols="12" md="3">
                  <div v-if="totalAssets <= 0">
                    <p class="text-right font-weight-bold underlined red--text text--darken-3">
                      <span>&#8369;{{ currency(totalAssets) }}</span>
                    </p>
                  </div>
                  <div v-else>
                    <p class="text-right font-weight-bold underlined blue--text text--darken-3">
                      <span>&#8369;{{ currency(totalAssets) }}</span>
                    </p>
                  </div>
                </v-col>
              </v-row>
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Current Liabilities</span>
              </v-row>
              <LiabilityComponent :accounts="filterItems(21000)"
                                     :total="totalBalance(21000)"
                                     :msg="totalMsg('Total Current Liabilities')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Non Current Liabilities</span>
              </v-row>
              <LiabilityComponent :accounts="filterItems(22000)"
                                  :total="totalBalance(22000)"
                                  :msg="totalMsg('Total Non Current Liabilities')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Equity</span>
              </v-row>
              <EquityComponent :accounts="filterItems(30100)"
                                     :total="totalBalance(30100)"
                                     :msg="totalMsg('Total Equity')"
                                     :netIncome="netProfit"
              />
              <v-row class="ml-4 mb-4">
                <v-col cols="12" md="5">
                  <div v-if="totalLiabilities <= 0">
                    <span class="font-weight-bold red--text text--darken-3">
                      Total Liabilities and Equity
                    </span>
                  </div>
                  <div v-else>
                    <span class="font-weight-bold blue--text text--darken-3">
                      Total Liabilities and Equity
                    </span>
                  </div>
                </v-col>
                <v-col cols="12" md="3"></v-col>
                <v-col cols="12" md="3">
                  <div v-if="totalLiabilities <= 0">
                    <p class="text-right font-weight-bold red--text text--darken-3 underlined">
                      <span>&#8369;{{ currency(totalLiabilities) }}</span>
                    </p>
                  </div>
                  <div v-else>
                    <p class="text-right font-weight-bold blue--text text--darken-3 underlined">
                      <span>&#8369;{{ currency(totalLiabilities) }}</span>
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import axios from 'axios'
import numeral from 'numeral'
import BalanceSheetComponent from './balanceSheet/BalanceSheetComponent'
import LiabilityComponent from './balanceSheet/LiabilityComponent'
import EquityComponent from './balanceSheet/EquityComponent'

export default {
  name: 'AdminBalanceSheetReport',
  components: { BalanceSheetComponent, LiabilityComponent, EquityComponent },
  data () {
    return {
      selectedBranch: { id: 0, branchName: 'DARBMUPCO-Common' },
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      items: [],
      profits: [],
      hidden: true,
      branches: [],
      loading: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    },
    totalBalance (typeId) {
      let filterItem = this.items.filter(item => {
        return item.id === typeId
      })
      let balances = filterItem.map(item => {
        let balance = parseFloat(item.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(sum).toFixed(2)
    },
    totalProfit (typeId) {
      let filterItem = this.profits.filter(item => {
        return item.id === typeId
      })
      let balances = filterItem.map(item => {
        let balance = parseFloat(item.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(sum).toFixed(2)
    },
    totalMsg (msg) {
      return msg
    },
    filterItems (typeId) {
      const revenues = this.items.filter(item => {
        return item.id === typeId
      })
      return revenues
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 0.5,
        filename: 'BalanceSheet.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    },
    async generate () {
      this.loading = true
      const year = moment(this.date).format('YYYY')
      try {
        const response = await axios.get(
          `/api/reports/balance-sheet/${this.selectedBranch.id}/${this.date}`
        )
        const profit = await axios.get(
          `/api/reports/net-profit/${this.selectedBranch.id}/${year}/${this.date}`
        )
        this.items = response.data
        this.profits = profit.data
        this.loading = false
      } catch (e) {
        this.getError(e.response.data)
        this.getError(e.profit.data)
        this.loading = false
      }
      this.hidden = false
    }
  },
  computed: {
    ...mapState(['auth']),
    formatDate () {
      return moment(this.date).format('MMMM DD YYYY')
    },
    totalAssets () {
      const current = parseFloat(this.totalBalance(11000))
      const nonCurrent = parseFloat(this.totalBalance(13000))
      return parseFloat(current + nonCurrent).toFixed(2)
    },
    totalLiabilities () {
      const currentLiability = (parseFloat(this.totalBalance(21000)) * (-1))
      const nonCurrentLiability = (parseFloat(this.totalBalance(22000)) * (-1))
      const equity = (parseFloat(this.totalBalance(30100)) * (-1))
      const netProfit = parseFloat(this.netProfit)
      return parseFloat(currentLiability + nonCurrentLiability + equity + netProfit).toFixed(2)
    },
    grossProfit () {
      const revenue = this.formatBalance(this.totalProfit(40000))
      const costOfGoods = this.formatBalance(this.totalProfit(50000))
      const costOfServices = this.formatBalance(this.totalProfit(60000))
      const answer = parseFloat(revenue) - (parseFloat(costOfGoods) + parseFloat(costOfServices))
      return parseFloat(answer).toFixed(2)
    },
    netProfit () {
      const netProfit = parseFloat(this.grossProfit) - parseFloat(this.formatBalance(this.totalProfit(70000)))
      return parseFloat(netProfit).toFixed(2)
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
      const branches = await axios.get('/api/admin/branches', config)
      this.branches = [{ id: 0, branchName: 'DARBMUPCO-Common' }, ...branches.data]
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>

<style scoped>
  #content {
    color: black;
    font-family: "Roboto", sans-serif;
  }
  .underlined {
    text-decoration-line: underline;
    text-decoration-style: double;
  }
 .text-center {
   text-align: center !important;
 }
</style>
