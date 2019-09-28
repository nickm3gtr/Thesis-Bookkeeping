<template>
  <div class="general-journal">
    <div class="text-center">
      <p>
        <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">General Journal</span></p>
      <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
      <hr>
    </div>
    <v-row class="ml-4">
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Date</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium">Memo</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium">Account</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">Credit</p>
      </v-col>
    </v-row>
    <hr>
    <div v-for="item in formatItems" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <span v-if="item.debit === null"></span>
          <span class="caption font-weight-medium" v-else>{{ item.date }}</span>
        </v-col>
        <v-col cols="12" md="3">
          <span v-if="item.debit === null"></span>
          <span class="caption font-weight-medium" v-else>{{ item.memo }}</span>
        </v-col>
        <v-col cols="12" md="3">
          <span class="caption font-weight-medium">{{ item.accountname }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.debit === 0" class="caption font-weight-medium text-right"></p>
          <p v-else class="caption font-weight-medium text-right">{{ item.debit }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.credit === 0" class="caption font-weight-medium text-right"></p>
          <p v-else class="caption font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
      </v-row>
    </div>
    <hr />
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Total</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium"></p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="caption font-weight-medium"></p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">{{ formatBalance(totalDebit) }}</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">{{ formatBalance(totalCredit) }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GeneralJournalComponent',
  props: [ 'formatFromDate', 'formatToDate', 'formatItems' ],
  methods: {
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    }
  },
  computed: {
    ...mapState(['auth']),
    totalDebit () {
      let removeZero = this.formatItems.map(item => {
        if (item.debit === null) {
          item.debit = 0
        }
        return item
      })
      let balances = removeZero.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalCredit () {
      let removeZero = this.formatItems.map(item => {
        if (item.credit === null) {
          item.credit = 0
        }
        return item
      })
      let balances = removeZero.map(item => {
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
