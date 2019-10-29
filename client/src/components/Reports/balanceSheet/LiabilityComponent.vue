<template>
  <div class="mx-12">
    <div v-for="(subType, index) in subTypes" :key="index">
      <span>{{subType}}</span>
      <div v-for="item in accounts" :key="item.account_id">
        <v-row class="ml-10">
          <v-col cols="12" md="5" v-if="item.subtype === subType">{{item.account}}</v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType"><p class="text-right">{{currency(formatBalance(item.balance))}}</p></v-col>
        </v-row>
      </div>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total({{subType}})</v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{currency(sum(subType))}}</p></v-col>
      </v-row>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="7">
        <span>{{ msg }}</span>
      </v-col>
      <v-col cols="12" md="3">
        <p class="text-right"><span class="type-total">{{ currency(formatBalance(total)) }}</span></p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'LiabilityComponent',
  props: ['accounts', 'total', 'msg'],
  methods: {
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (val) {
      return parseFloat(val * (-1)).toFixed(2)
    },
    sum (subType) {
      const subtypes = this.accounts.filter(account => {
        return account.subtype === subType
      })
      const subtypeBalance = subtypes.map(subtype => {
        return parseFloat(subtype.balance)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(subtypeBalance)
      const answer = parseFloat(sum) * (-1)
      return parseFloat(answer).toFixed(2)
    }
  },
  computed: {
    subTypes () {
      const subs = this.accounts.map(account => {
        const sub = account.subtype
        return sub
      })
      const uniqueSubs = [ ...new Set(subs) ]
      return [...uniqueSubs]
    }
  }
}
</script>

<style scoped>

 .font-weight-medium {
   font-size: 12px;
   color: black;
 }
 .text-right {
   text-align: right;
 }
 .total {
   text-decoration-line: underline;
 }
 .type-total {
   text-decoration-line: underline;
   text-decoration-style: double;
 }
</style>
