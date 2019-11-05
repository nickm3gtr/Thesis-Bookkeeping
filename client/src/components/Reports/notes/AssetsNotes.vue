<template>
  <div class="mx-12">
    <div class="mx-12">
      <v-row class="ml-10">
        <v-col cols="12" md="5"></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small">{{bigYear}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small">{{smallYear}}</p></v-col>
      </v-row>
    </div>
    <div v-for="(subType, index) in subTypes" :key="index">
      <span class="x-small">{{index + 1}}. {{subType}}</span>
      <div v-for="item in accounts" :key="item.account_id">
        <v-row class="ml-10">
          <v-col cols="12" md="5" v-if="item.subtype === subType">
            <p v-if="!item.sub" class="x-small">{{item.account}}</p>
            <p v-else-if="!item.sub.sub" class="x-small">{{item.account}}:{{item.sub.name}}</p>
            <p v-else-if="item.sub.sub" class="x-small">{{item.account}}:{{item.sub.name}}:{{item.sub.sub}}</p>
          </v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType">
            <p class="text-right right x-small">{{currency(formatBalance(item.balance2))}}</p>
          </v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType">
            <p class="text-right right x-small">{{currency(formatBalance(item.balance1))}}</p>
           </v-col>
        </v-row>
      </div>
      <v-row class="ml-10">
        <v-col cols="12" md="5"><p class="x-small">Total({{subType}})</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right total x-small">{{currency(sumSecondBalance(subType))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right total x-small">{{currency(sumFirstBalance(subType))}}</p></v-col>
      </v-row>
      <hr />
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'AssetsNotes',
  props: ['accounts', 'bigYear', 'smallYear'],
  methods: {
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    formatBalance (val) {
      return parseFloat(val).toFixed(2)
    },
    sumSecondBalance (subType) {
      const subtypes = this.accounts.filter(account => {
        return account.subtype === subType
      })
      const subtypeBalance = subtypes.map(subtype => {
        return parseFloat(subtype.balance2)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(subtypeBalance)
      return parseFloat(sum).toFixed(2)
    },
    sumFirstBalance (subType) {
      const subtypes = this.accounts.filter(account => {
        return account.subtype === subType
      })
      const subtypeBalance = subtypes.map(subtype => {
        return parseFloat(subtype.balance1)
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
