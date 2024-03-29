<template>
  <div class="ledger-report">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6" min-height="400">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12">
                <span class="title font-weight-light">Generate Ledger</span>
              </v-col>
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
                      label="From"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker no-title v-model="fromDate" @input="fromMenu = false"></v-date-picker>
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
                  <v-date-picker no-title v-model="toDate" @input="toMenu = false"></v-date-picker>
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
                <v-btn dark color="primary" class="mx-2" @click="generate">Generate</v-btn>
                <v-btn dark color="success" class="mx-2" @click="pdf">Download PDF</v-btn>
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
          <div id="content" :hidden="hidden" v-if="loading === false">
            <v-card-text>
              <div class="text-center">
                <p>
                  <span
                    v-if="auth.user === null || auth.user.account == 'admin'"
                    class="headline"
                  >{{ selectedBranch.branchName }}</span>
                  <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
                </p>
                <p>
                  <span class="subtitle-1">General Ledger</span>
                </p>
                <p>
                  <span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span>
                </p>
              </div>
              <hr />
              <v-row class="ml-12">
                <v-col cols="12" md="4">
                  <span class="font-weight-medium">Account</span>
                </v-col>
                <v-col cols="12" md="2">
                  <p class="text-right">
                    <span class="font-weight-medium">Debit</span>
                  </p>
                </v-col>
                <v-col cols="12" md="2">
                  <p class="text-right">
                    <span class="font-weight-medium">Credit</span>
                  </p>
                </v-col>
                <v-col cols="12" md="2">
                  <p class="text-right">
                    <span class="font-weight-medium">Balance</span>
                  </p>
                </v-col>
              </v-row>
              <hr />
              <br />
              <CurrentAssets :currentAssets="currentAssets" :balance="balanceCurrentAsset" />
              <NonCurrentAssets
                :nonCurrentAssets="nonCurrentAssets"
                :balance="balanceNonCurrentAsset"
              />
              <CurrentLiabilities
                :currentLiabilities="currentLiabilities"
                :balance="balanceCurrentLiabilities"
              />
              <NonCurrentLiabilities
                :nonCurrentLiabilities="nonCurrentLiabilities"
                :balance="balanceNonCurrentLiabilities"
              />
              <Equity :equity="equity" :balance="balanceEquity" />
              <Revenue :revenue="revenue" :balance="balanceRevenue" />
              <CostOfGoodsSold :costOfGoods="costOfGoods" :balance="balanceCostOfGoods" />
              <CostOfServices :costOfServices="costOfServices" :balance="balanceCostOfServices" />
              <Expenses :expenses="expenses" :balance="balanceExpenses" />
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import CurrentAssets from '@/components/Reports/ledgers/CurrentAssets'
import NonCurrentAssets from '@/components/Reports/ledgers/NonCurrentAssets'
import CurrentLiabilities from '@/components/Reports/ledgers/CurrentLiabilities'
import NonCurrentLiabilities from '@/components/Reports/ledgers/NonCurrentLiabilities'
import Equity from '@/components/Reports/ledgers/Equity'
import Revenue from '@/components/Reports/ledgers/Revenue'
import CostOfGoodsSold from '@/components/Reports/ledgers/CostOfGoodsSold'
import CostOfServices from '@/components/Reports/ledgers/CostOfServices'
import Expenses from '@/components/Reports/ledgers/Expenses'

export default {
  name: 'AdminLedgerReport',
  components: {
    CurrentAssets,
    NonCurrentAssets,
    CurrentLiabilities,
    NonCurrentLiabilities,
    Equity,
    Revenue,
    CostOfGoodsSold,
    CostOfServices,
    Expenses
  },
  data () {
    return {
      selectedBranch: { id: 0, branchName: 'DARBMUPCO-Common' },
      fromMenu: false,
      toMenu: false,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      items: [],
      hidden: true,
      branches: [],
      loading: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async generate () {
      this.loading = true
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const response = await axios.get(
          `/api/reports/ledger/${this.selectedBranch.id}/${this.fromDate}/${this.toDate}`,
          config
        )
        this.items = response.data
        this.loading = false
      } catch (e) {
        this.getError(e.response.data)
        this.loading = false
      }
      this.hidden = false
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 1,
        filename: 'Ledger.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf()
        .from(element)
        .set(opt)
        .save()
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
    formatItems () {
      const a = this.items.map(item => {
        item.date = moment(item.date).format('MMM DD YYYY')
        return item
      })
      return a
    },
    currentAssets () {
      return this.items.filter(item => {
        return item.id === 11000
      })
    },
    nonCurrentAssets () {
      return this.items.filter(item => {
        return item.id === 13000
      })
    },
    currentLiabilities () {
      return this.items.filter(item => {
        return item.id === 21000
      })
    },
    nonCurrentLiabilities () {
      return this.items.filter(item => {
        return item.id === 22000
      })
    },
    equity () {
      return this.items.filter(item => {
        return item.id === 30100
      })
    },
    revenue () {
      return this.items.filter(item => {
        return item.id === 40000
      })
    },
    costOfGoods () {
      return this.items.filter(item => {
        return item.id === 50000
      })
    },
    costOfServices () {
      return this.items.filter(item => {
        return item.id === 60000
      })
    },
    expenses () {
      return this.items.filter(item => {
        return item.id === 70000
      })
    },
    subsidy () {
      return this.items.filter(item => {
        return item.id === 80000
      })
    },
    balanceCurrentAsset () {
      let balances = this.currentAssets.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceNonCurrentAsset () {
      let balances = this.nonCurrentAssets.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceCurrentLiabilities () {
      let balances = this.currentLiabilities.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceNonCurrentLiabilities () {
      let balances = this.nonCurrentLiabilities.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceEquity () {
      let balances = this.equity.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceRevenue () {
      let balances = this.revenue.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceCostOfGoods () {
      let balances = this.costOfGoods.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceCostOfServices () {
      let balances = this.costOfServices.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceExpenses () {
      let balances = this.expenses.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
    },
    balanceSubsidy () {
      let balances = this.subsidy.map(asset => {
        let balance = parseFloat(asset.balance)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return parseFloat(Math.round(sum * 100) / 100).toFixed(2)
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
 .text-center {
   text-align: center !important;
 }
</style>
