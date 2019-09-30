<template>
  <div>
    <v-layout>
      <v-flex sm12 md12>
        <v-card>
          <v-card-title>
            <v-row>
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
              <v-col cols="12" md="3"></v-col>
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
          <div id="content">
            <v-card-text>
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                    <span v-else class="headline">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-1">Balance Sheet</span></p>
                  <p><span class="subtitle-2">As of {{ formatDate }}</span></p>
                </div>
              </v-flex>
              <hr>
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Current Assets</span>
              </v-row>
              <BalanceSheetComponent :accounts="filterItems(11000, 12999)"
                             :total="totalBalance(11000, 12999)"
                             :msg="totalMsg('Total Current Assets')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Non Current Assets</span>
              </v-row>
              <BalanceSheetComponent :accounts="filterItems(13000, 19999)"
                             :total="totalBalance(13000, 20999)"
                             :msg="totalMsg('Total Non Current Assets')"
              />
              <v-row class="ml-4 mb-4">
                <v-col cols="12" md="5">
                  <span class="font-weight-bold">Total Assets</span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="3">
                  <p class="text-right font-weight-bold underlined"><span>{{ totalAssets }}</span></p>
                </v-col>
              </v-row>
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Current Liabilities</span>
              </v-row>
              <LiabilityComponent :accounts="filterItems(21000, 21999)"
                                     :total="totalBalance(21000, 21999)"
                                     :msg="totalMsg('Total Current Liabilities')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Non Current Liabilities</span>
              </v-row>
              <LiabilityComponent :accounts="filterItems(22000, 29999)"
                                  :total="totalBalance(22000, 29999)"
                                  :msg="totalMsg('Total Non Current Liabilities')"
              />
              <v-row class="ml-4 mt-4">
                <span class="subtitle-1 font-weight-bold">Equity</span>
              </v-row>
              <LiabilityComponent :accounts="filterItems(30000, 39999)"
                                     :total="totalBalance(30000, 39999)"
                                     :msg="totalMsg('Total Equity')"
              />
              <v-row class="ml-4 mb-4">
                <v-col cols="12" md="5">
                  <span class="font-weight-medium">Net Income</span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="3">
                  <p class="text-right font-weight-medium"><span>{{ netProfit }}</span></p>
                </v-col>
              </v-row>
              <v-row class="ml-4 mb-4">
                <v-col cols="12" md="5">
                  <span class="font-weight-bold">Total Liabilities and Equity</span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="3">
                  <p class="text-right font-weight-bold underlined"><span>{{ totalLiabilities }}</span></p>
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
import { mapState } from 'vuex'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import axios from 'axios'
import BalanceSheetComponent from './balanceSheet/BalanceSheetComponent'
import LiabilityComponent from './balanceSheet/LiabilityComponent'

export default {
  name: 'BalanceSheetReport',
  components: { BalanceSheetComponent, LiabilityComponent },
  data () {
    return {
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      items: [],
      profits: []
    }
  },
  methods: {
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    },
    totalBalance (min, max) {
      let filterItem = this.items.filter(item => {
        return item.id >= min && item.id <= max
      })
      let balances = filterItem.map(item => {
        let balance = parseFloat(item.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(sum).toFixed(2)
    },
    totalProfit (min, max) {
      let filterItem = this.profits.filter(item => {
        return item.id >= min && item.id <= max
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
    filterItems (min, max) {
      const revenues = this.items.filter(item => {
        return item.id >= min && item.id <= max
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
      try {
        const response = await axios.get(
          `/api/reports/balance-sheet/${this.auth.user.BranchId}/${this.date}`
        )
        const profit = await axios.get(
          `/api/reports/net-profit/${this.auth.user.BranchId}/${this.date}`
        )
        this.items = response.data
        this.profits = profit.data
      } catch (e) {
        this.getError(e.response.data)
        this.getError(e.profit.data)
      }
    }
  },
  computed: {
    ...mapState(['auth']),
    formatDate () {
      return moment(this.date).format('MMMM DD YYYY')
    },
    totalAssets () {
      const current = parseFloat(this.totalBalance(11000, 12999))
      const nonCurrent = parseFloat(this.totalBalance(13000, 20999))
      return parseFloat(current + nonCurrent).toFixed(2)
    },
    totalLiabilities () {
      const currentLiability = (parseFloat(this.totalBalance(21000, 21999)) * (-1))
      const nonCurrentLiability = (parseFloat(this.totalBalance(22000, 29999)) * (-1))
      const equity = (parseFloat(this.totalBalance(30000, 39999)) * (-1))
      const netProfit = parseFloat(this.netProfit)
      return parseFloat(currentLiability + nonCurrentLiability + equity + netProfit).toFixed(2)
    },
    grossProfit () {
      const revenue = this.formatBalance(this.totalProfit(40000, 50000))
      const costOfGoods = this.formatBalance(this.totalProfit(50000, 60000))
      const costOfServices = this.formatBalance(this.totalProfit(60000, 70000))
      const answer = parseFloat(revenue) - (parseFloat(costOfGoods) + parseFloat(costOfServices))
      return parseFloat(answer).toFixed(2)
    },
    netProfit () {
      const netProfit = parseFloat(this.grossProfit) - parseFloat(this.formatBalance(this.totalProfit(70000, 80000)))
      return parseFloat(netProfit).toFixed(2)
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
</style>
