<template>
  <div>
    <div class="text-center">
      <p>
        <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
        <span v-else class="headline centered">{{
          auth.user.Branch.branchName
        }}</span>
      </p>
      <p><span class="subtitle-1">Purchases Journal</span></p>
      <p>
        <span class="subtitle-2"
        >{{ formatFromDate }} through {{ formatToDate }}</span
        >
      </p>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium">Vendor</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-center">A/P Credit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-center">Inventory Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-center">Office Supplies Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-center">Others</p>
      </v-col>
    </v-row>
    <hr/>
    <div v-for="(item, index) in filterDebits" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <p v-if="(index + 1) % 9 === 0" class="html2pdf__page-break">
            <span class="caption font-weight-medium">{{
              item.memo
            }}</span>
          </p>
          <p v-else>
            <span class="caption font-weight-medium">{{
              item.memo
            }}</span>
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="caption font-weight-medium text-right">{{ item.debit }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'inventory'"></p>
          <p v-else class="caption font-weight-medium text-right">
            {{ item.debit }}
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p v-if="item.tags !== 'office'"></p>
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
          {{ formatBalance(totalDebit) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalInventory) }}
        </p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="caption font-weight-medium text-right">
          {{ formatBalance(totalOffice) }}
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
  name: 'PurchaseComponent',
  props: ['formatFromDate', 'formatToDate', 'formatItems'],
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
    },
    totalInventory () {
      const salaries = this.filterDebits.filter(debit => {
        return debit.tags === 'inventory'
      })
      let balances = salaries.map(item => {
        let balance = parseFloat(item.debit)
        return parseFloat(this.formatBalance(balance))
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(balances)
      return sum
    },
    totalOffice () {
      const expenses = this.filterDebits.filter(debit => {
        return debit.tags === 'office'
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
