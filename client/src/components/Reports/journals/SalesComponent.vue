<template>
  <div>
    <div class="text-center">
      <p>
        <span v-if="auth.user === null || auth.user.account == 'admin'" class="headline">
          {{ selectedBranch.branchName }}
        </span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">Sales Journal</span></p>
      <p>
        <span class="subtitle-2"
        >{{ formatFromDate }} through {{ formatToDate }}</span
        >
      </p>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Date</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">TransId</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium">Debit Account</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Debit(A/R)</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Credit(Sales)</p>
      </v-col>
    </v-row>
    <hr/>
    <div v-for="item in filterDebits" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium">{{ item.date }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium">{{ item.trans_id }}</p>
        </v-col>
        <v-col cols="12" md="3">
          <p v-if="!item.sub" class="caption font-weight-medium">{{ item.accountname }}</p>
          <p v-else-if="!item.sub.sub" class="caption font-weight-medium">{{ item.accountname }}:{{item.sub.name}}</p>
          <p v-else-if="item.sub.sub" class="caption font-weight-medium">{{ item.accountname }}:{{item.sub.name}}:{{item.sub.sub}}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium text-right">{{ currency(item.debit) }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium text-right">{{ currency(item.debit) }}</p>
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
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium"></p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalDebit)) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ currency(formatBalance(totalDebit)) }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'

export default {
  name: 'SalesComponent',
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
    filterDebits () {
      const debits = this.formatItems.filter(item => {
        // eslint-disable-next-line eqeqeq
        return item.credit === null || item.credit == 0
      })
      const tags = debits.map(debit => {
        if (debit.account_id >= 11510 && debit.account_id <= 11590) {
          debit.tags = 'inventory'
        } else if (debit.account_id === 73370) {
          debit.tags = 'office'
        } else {
          debit.tags = 'others'
        }
        return debit
      })
      return tags
    },
    totalDebit () {
      let balances = this.filterDebits.map(item => {
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
