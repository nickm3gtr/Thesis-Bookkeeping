<template>
  <div class="mx-12">
    <div v-for="(subType, index) in subTypes" :key="index">
      <span class="small">{{subType}}</span>
      <div v-for="item in accounts" :key="item.account_id">
        <v-row class="ml-10">
          <v-col cols="12" md="5" v-if="item.subtype === subType">
            <p v-if="!item.sub" class="x-small">{{item.account}}</p>
            <p v-else-if="!item.sub.sub" class="x-small">{{item.account}}:{{item.sub.name}}</p>
            <p v-else-if="item.sub.sub" class="x-small">{{item.account}}:{{item.sub.name}}:{{item.sub.sub}}</p>
          </v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType"><p class="text-right right x-small">{{currency(formatBalance(item.balance))}}</p></v-col>
        </v-row>
      </div>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total({{subType}})</v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sum(subType))}}</p></v-col>
      </v-row>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="7">
        <span class="x-small">{{ msg }}</span>
      </v-col>
      <v-col cols="12" md="3">
        <p class="text-right type-total x-small right"><span>{{ currency(formatBalance(total)) }}</span></p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'ExpenseComponent',
  props: ['accounts', 'total', 'msg'],
  methods: {
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
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
      return parseFloat(sum).toFixed(2)
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
 .right {
   text-align: right !important;
 }
 .small {
   font-size: small;
 }
 .x-small {
   font-size: 12px;
   color: black;
 }
</style>
