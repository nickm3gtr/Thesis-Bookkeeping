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
        <p class="caption font-weight-medium">TransId</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Account Credited</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Cash Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Sales Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">A/R Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Others</p>
      </v-col>
    </v-row>
    <hr/>
    <div v-for="item in filterCredits" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <p>
            <span class="caption font-weight-medium">{{
              item.trans_id
            }}</span>
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="!item.sub" class="caption font-weight-medium">{{ item.accountname }}</p>
          <p v-else-if="!item.sub.sub" class="caption font-weight-medium">{{ item.accountname }}:{{item.sub.name}}</p>
          <p v-else-if="item.sub.sub" class="caption font-weight-medium">{{ item.accountname }}:{{item.sub.name}}:{{item.sub.sub}}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium text-right">{{ currency(item.credit) }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'sales'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ currency(item.credit) }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'a/r'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ currency(item.credit) }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'others'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ currency(item.credit) }}
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
        <p class="caption font-weight-medium"></p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalCash)) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalSales)) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalAR)) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalOthers)) }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'

export default {
  name: 'CashReceiptComponent',
  props: ['formatFromDate', 'formatToDate', 'formatItems', 'selectedBranch'],
  methods: {
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (value) {
      return parseFloat(value).toFixed(2)
    }
  },
  computed: {
    ...mapState(['auth']),
    filterCredits () {
      const credits = this.formatItems.filter(item => {
        return item.debit === null || item.debit === 0
      })
      const tags = credits.map(credit => {
        if (credit.account_id >= 40300 && credit.account_id <= 40390) {
          credit.tags = 'sales'
        } else if (credit.account_id >= 11200 && credit.account_id <= 11280) {
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
