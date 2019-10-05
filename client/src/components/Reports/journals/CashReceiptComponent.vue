<template>
  <div class="general-journal">
    <div class="text-center">
      <p>
        <span v-if="auth.user === null || auth.user.account == 'admin'" class="headline">
          {{ selectedBranch.branchName }}
        </span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">Cash Receipts Journal</span></p>
      <p>
        <span class="subtitle-2"
          >{{ formatFromDate }} through {{ formatToDate }}</span
        >
      </p>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Account Credited</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Cash Received</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Sales Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">L/R Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">A/R Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Others</p>
      </v-col>
    </v-row>
    <hr/>
    <div v-for="(item, index) in filterCredits" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <p v-if="(index + 1) % 9 === 0" class="html2pdf__page-break">
            <span class="caption font-weight-medium">{{
              item.accountname
            }}</span>
          </p>
          <p v-else>
            <span class="caption font-weight-medium">{{
              item.accountname
            }}</span>
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'sales'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.credit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'loans'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.credit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'a/r'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.credit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'others'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.credit }}
          </p>
        </v-col>
      </v-row>
    </div>
    <hr />
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Total</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalCash) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalSales) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalLoans) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalAR) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalOthers) }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CashReceiptComponent',
  props: ['formatFromDate', 'formatToDate', 'formatItems', 'selectedBranch'],
  methods: {
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }
  },
  computed: {
    ...mapState(['auth']),
    filterCredits () {
      const credits = this.formatItems.filter(item => {
        return item.debit === null
      })
      const tags = credits.map(credit => {
        if (credit.account_id >= 40300 && credit.account_id <= 40390) {
          credit.tags = 'sales'
        } else if (credit.account_id >= 11210 && credit.account_id <= 11240) {
          credit.tags = 'loans'
        } else if (credit.account_id >= 11250 && credit.account_id <= 11280) {
          credit.tags = 'a/r'
        } else {
          credit.tags = 'others'
        }
        return credit
      })
      return tags
    },
    totalCash () {
      let balances = this.filterCredits.map(item => {
        let balance = parseFloat(item.credit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalSales () {
      const sales = this.filterCredits.filter(credit => {
        return credit.tags === 'sales'
      })
      let balances = sales.map(item => {
        let balance = parseFloat(item.credit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalLoans () {
      const loans = this.filterCredits.filter(credit => {
        return credit.tags === 'loans'
      })
      let balances = loans.map(item => {
        let balance = parseFloat(item.credit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalAR () {
      const ar = this.filterCredits.filter(credit => {
        return credit.tags === 'a/r'
      })
      let balances = ar.map(item => {
        let balance = parseFloat(item.credit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalOthers () {
      const others = this.filterCredits.filter(credit => {
        return credit.tags === 'others'
      })
      let balances = others.map(item => {
        let balance = parseFloat(item.credit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    }
  }
}
</script>

<style scoped></style>
