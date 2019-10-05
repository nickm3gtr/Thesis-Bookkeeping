<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined elevation="10" class="mb-10" min-height="400">
          <v-toolbar color="light-blue darken-3" dark>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="3">
                <v-menu
                  ref="menu"
                  v-model="fromMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fromDate"
                      label="Choose Date"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    v-model="fromDate"
                    @input="fromMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-menu
                  ref="toMenu"
                  v-model="toMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="toDate"
                      label="To"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    v-model="toDate"
                    @input="toMenu = false"
                  ></v-date-picker>
                </v-menu>
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
          <div id="content" :hidden="hidden">
            <v-card-text>
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                    <span v-else class="headline">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-1">Income Statement</span></p>
                  <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
                </div>
                <hr>
                <v-row class="ml-4 mt-4">
                  <span class="subtitle-1 font-weight-bold">Revenues</span>
                </v-row>
                <ItemComponent :accounts="filterItems(40000, 50000)"
                                  :total="totalBalance(40000, 50000)"
                                  :msg="totalMsg('Total Revenue')"
                />
                <v-row class="ml-4 mt-4">
                  <span class="subtitle-1 font-weight-bold">Cost of Goods Sold</span>
                </v-row>
                <ItemComponent :accounts="filterItems(50000, 60000)"
                               :total="totalBalance(50000, 60000)"
                               :msg="totalMsg('Total Cost of Goods Sold')"
                />
                <v-row class="ml-4 mt-4">
                  <span class="subtitle-1 font-weight-bold">Cost of Services</span>
                </v-row>
                <ItemComponent :accounts="filterItems(60000, 70000)"
                               :total="totalBalance(60000, 70000)"
                               :msg="totalMsg('Total Cost of Services')"
                />
                <v-row class="ml-4 mb-4">
                  <v-col cols="12" md="5">
                    <span class="font-weight-bold">Gross Profit</span>
                  </v-col>
                  <v-col cols="12" md="4"></v-col>
                  <v-col cols="12" md="3">
                    <p class="text-right font-weight-bold"><span>{{ grossProfit }}</span></p>
                  </v-col>
                </v-row>
                <v-row class="ml-4 mt-4">
                  <span class="subtitle-1 font-weight-bold">Expenses</span>
                </v-row>
                <ItemComponent :accounts="filterItems(70000, 80000)"
                               :total="totalBalance(70000, 80000)"
                               :msg="totalMsg('Total Expenses')"
                />
                <hr>
                <v-row class="ml-4 mb-4">
                  <v-col cols="12" md="5">
                    <span v-if="netProfit < 0" class="font-weight-bold red--text">Net Loss</span>
                    <span v-else class="font-weight-bold">Net Income</span>
                  </v-col>
                  <v-col cols="12" md="4"></v-col>
                  <v-col cols="12" md="3">
                    <p v-if="netProfit < 0"
                      class="text-right font-weight-bold red--text"><span>{{ formatBalance(netProfit) }}</span></p>
                    <p v-else class="text-right font-weight-bold"><span>{{ formatBalance(netProfit) }}</span></p>
                  </v-col>
                </v-row>
              </v-flex>
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
import ItemComponent from './incomeStatement/ItemComponent'

export default {
  name: 'IncomeStatementReport',
  components: {
    ItemComponent
  },
  data () {
    return {
      fromMenu: false,
      toMenu: false,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      items: [],
      hidden: true
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
      return sum
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
        filename: 'IncomeStatement.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    },
    async generate () {
      try {
        const response = await axios.get(
          `/api/reports/income-statement/${this.auth.user.BranchId}/${this.fromDate}/${this.toDate}`
        )
        this.items = response.data
      } catch (e) {
        this.getError(e.response.data)
      }
      this.hidden = false
    }
  },
  computed: {
    ...mapState(['auth']),
    formatFromDate () {
      return moment(this.fromDate).format('MMMM DD')
    },
    formatToDate () {
      return moment(this.toDate).format('MMMM DD YYYY')
    },
    grossProfit () {
      const revenue = this.formatBalance(this.totalBalance(40000, 50000))
      const costOfGoods = this.formatBalance(this.totalBalance(50000, 60000))
      const costOfServices = this.formatBalance(this.totalBalance(60000, 70000))
      const answer = parseFloat(revenue) - (parseFloat(costOfGoods) + parseFloat(costOfServices))
      return parseFloat(answer).toFixed(2)
    },
    netProfit () {
      const netProfit = parseFloat(this.grossProfit) - parseFloat(this.formatBalance(this.totalBalance(70000, 80000)))
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
</style>