<template>
  <div class="general-journal">
    <div class="text-center">
      <p>
        <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">Cash Receipts Journal</span></p>
      <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
      <hr>
    </div>
    <v-row>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">Date</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">OR</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium">Account Credited</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium text-center">Cash Received</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">Sales Credit</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">L/R Credit</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">A/R Credit</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">Others</p>
      </v-col>
    </v-row>
    <hr>
    <div v-for="item in filterCredits" :key="item.id">
      <v-row>
        <v-col cols="12" md="1">
          <p class="text-center"><span class="body-2 font-weight-medium">{{ item.date }}</span></p>
        </v-col>
        <v-col cols="12" md="1">
          <p class="text-center"><span class="body-2 font-weight-medium">{{ item.num }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p><span class="body-2 font-weight-medium">{{ item.accountname }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="body-2 font-weight-medium text-center">{{ item.credit }}</p>
        </v-col>
        <v-col cols="12" md="1">
          <p v-if="item.tags !== 'sales'"></p>
          <p v-else class="body-2 font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
        <v-col cols="12" md="1">
          <p v-if="item.tags !== 'loans'"></p>
          <p v-else class="body-2 font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
        <v-col cols="12" md="1">
          <p v-if="item.tags !== 'a/r'"></p>
          <p v-else class="body-2 font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
        <v-col cols="12" md="1">
          <p v-if="item.tags !== 'others'"></p>
          <p v-else class="body-2 font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
      </v-row>
    </div>
    <hr>
    <v-row>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">Total</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center"></p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium"></p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium text-center">{{ formatBalance(totalCash) }}</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">{{ formatBalance(totalSales) }}</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">{{ formatBalance(totalLoans) }}</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">{{ formatBalance(totalAR) }}</p>
      </v-col>
      <v-col cols="12" md="1">
        <p class="font-weight-medium text-center">{{ formatBalance(totalOthers) }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CashReceiptComponent',
  props: [ 'formatFromDate', 'formatToDate', 'formatItems' ],
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

<style scoped>

</style>
