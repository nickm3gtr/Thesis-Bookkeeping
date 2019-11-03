<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6" min-height="400">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12">
                <span class="title font-weight-light">Generate Trial Balance</span>
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
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                  <span
                    v-if="auth.user === null || auth.user.account == 'admin'"
                    class="headline"
                  >{{ selectedBranch.branchName }}</span>
                  <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-1">Trial Balance</span></p>
                  <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
                </div>
                <hr>
                <div class="text-center"></div>
                <v-row>
                  <v-col cols="12" md="2">
                    <p class="font-weight-medium small">Type</p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <p class="font-weight-medium small">Category</p>
                  </v-col>
                  <v-col cols="12" md="3 ">
                    <p class="font-weight-medium small">Account</p>
                  </v-col>
                  <v-col cols="12" md="2">
                    <p class="font-weight-medium text-right small">Debit</p>
                  </v-col>
                  <v-col cols="12" md="2">
                    <p class="font-weight-medium text-right small">Credit</p>
                  </v-col>
                </v-row>
                <hr>
                <div v-for="item in filterNullItems" :key="item.id">
                  <v-row>
                    <v-col cols="12" md="2">
                      <span class="font-weight-medium x-small">{{ item.type }}</span>
                    </v-col>
                    <v-col cols="12" md="3">
                      <span class="font-weight-medium x-small">{{ item.subtype }}</span>
                    </v-col>
                    <v-col cols="12" md="3">
                      <span v-if="!item.sub" class="font-weight-medium x-small">{{ item.account }}</span>
                      <span v-else-if="!item.sub.sub" class="caption font-weight-medium">{{ item.account }}:{{item.sub.name}}</span>
                      <span v-else-if="item.sub.sub" class="caption font-weight-medium">{{ item.account }}:{{item.sub.name}}:{{item.sub.sub}}</span>
                    </v-col>
                    <v-col cols="12" md="2">
                      <p v-if="item.balance>0" class="text-right">
                        <span class="font-weight-medium x-small">{{ currency(formatBalance(item.balance)) }}</span>
                      </p>
                      <p v-else class="text-right"><span class="font-weight-medium x-small">0.00</span></p>
                    </v-col>
                    <v-col cols="12" md="2">
                      <p v-if="item.balance<0" class="text-right"><span class="font-weight-medium x-small">{{ currency(formatBalance(item.balance)) }}</span></p>
                      <p v-else class="text-right"><span class="font-weight-medium x-small">0.00</span></p>
                    </v-col>
                  </v-row>
                </div>
                <hr>
                <v-row>
                  <v-col cols="12" md="2">
                    <span class="font-weight-medium">TOTAL</span>
                  </v-col>
                  <v-col cols="12" md="3">
                    <span class="font-weight-medium"></span>
                  </v-col>
                  <v-col cols="12" md="3">
                    <span class="font-weight-medium"></span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <p v-if="this.items.length <= 0"></p>
                    <p v-else class="underlined text-right"><span class="font-weight-medium x-small">{{ currency(formatBalance(totalDebit)) }}</span></p>
                  </v-col>
                  <v-col cols="12" md="2">
                    <p v-if="this.items.length <= 0"></p>
                    <p v-else class="underlined text-right"><span class="font-weight-medium x-small">{{ currency(formatBalance(totalCredit)) }}</span></p>
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
import numeral from 'numeral'

export default {
  name: 'TrialBalanceReport',
  data () {
    return {
      selectedBranch: { id: 0, branchName: 'DARBMUPCO' },
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
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 0.5,
        filename: 'TrialBalance.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    },
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
          `/api/reports/trial-balance/${this.auth.user.BranchId}/${this.fromDate}/${this.toDate}`, config
        )
        this.items = response.data
        this.loading = false
      } catch (e) {
        this.getError(e.response.data)
        this.loading = false
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
    filterNullItems () {
      return this.items.filter(item => {
        return item.balance !== null
      })
    },
    filterDebit () {
      const debits = this.items.filter(item => {
        return item.balance > 0
      })
      const debitBalance = debits.map(debit => {
        return debit.balance
      })
      return debitBalance
    },
    filterCredit () {
      const credits = this.items.filter(item => {
        return item.balance < 0
      })
      const creditBalance = credits.map(credit => {
        return credit.balance
      })
      return creditBalance
    },
    totalDebit () {
      let balances = this.filterDebit.map(debit => {
        let balance = parseFloat(debit)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalCredit () {
      let balances = this.filterCredit.map(debit => {
        let balance = parseFloat(debit)
        return balance
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
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
 .small {
   font-size: small;
 }
 .x-small {
   font-size: 12px;
   color: black;
 }
</style>
