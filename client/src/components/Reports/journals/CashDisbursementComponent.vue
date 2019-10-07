<template>
  <div>
    <div class="text-center">
      <p>
        <span v-if="auth.user === null || auth.user.account == 'admin'" class="headline">
          {{ selectedBranch.branchName }}
        </span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">Cash Disbursements Journal</span></p>
      <p>
        <span class="subtitle-2"
        >{{ formatFromDate }} through {{ formatToDate }}</span
        >
      </p>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Account Debited</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Cash Paid</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">A/P Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Salaries Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Expenses Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Others</p>
      </v-col>
    </v-row>
    <hr/>
    <div v-for="(item, index) in filterDebits" :key="item.trans_id">
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
          <p class="caption font-weight-medium text-right">{{ item.debit }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'a/p'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.debit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'salaries'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.debit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'expenses'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.debit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'others'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.debit }}
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
          {{ formatBalance(totalAP) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalSalaries) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalExpenses) }}
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
  name: 'CashDisbursementComponent',
  props: ['formatFromDate', 'formatToDate', 'formatItems', 'selectedBranch'],
  methods: {
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }
  },
  computed: {
    ...mapState(['auth']),
    filterDebits () {
      const debits = this.formatItems.filter(item => {
        return item.credit === null
      })
      const tags = debits.map(debit => {
        if (debit.account_id >= 21210 && debit.account_id <= 21220) {
          debit.tags = 'a/p'
        } else if (debit.account_id === 61210 || debit.account_id === 62210 || debit.account_id === 72210 || debit.account_id === 73210) {
          debit.tags = 'salaries'
        } else if (debit.account_id >= 70000 && debit.account_id < 80000) {
          debit.tags = 'expenses'
        } else {
          debit.tags = 'others'
        }
        return debit
      })
      return tags
    },
    totalCash () {
      let balances = this.filterDebits.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalAP () {
      const ap = this.filterDebits.filter(debit => {
        return debit.tags === 'a/p'
      })
      let balances = ap.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalSalaries () {
      const salaries = this.filterDebits.filter(debit => {
        return debit.tags === 'salaries'
      })
      let balances = salaries.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalExpenses () {
      const expenses = this.filterDebits.filter(debit => {
        return debit.tags === 'expenses'
      })
      let balances = expenses.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalOthers () {
      const others = this.filterDebits.filter(debit => {
        return debit.tags === 'others'
      })
      let balances = others.map(item => {
        let balance = parseFloat(item.debit)
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
