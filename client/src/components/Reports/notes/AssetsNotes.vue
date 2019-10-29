<template>
  <div class="mx-12">
    <div v-for="(subType, index) in subTypes" :key="index">
      <span>{{index + 1}}. {{subType}}</span>
      <div v-for="item in accounts" :key="item.account_id">
        <v-row class="ml-10">
          <v-col cols="12" md="5" v-if="item.subtype === subType">{{item.account}}</v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType">
            <p class="text-right">{{currency(formatBalance(item.balance2))}}</p>
          </v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType">
            <p class="text-right">{{currency(formatBalance(item.balance1))}}</p>
           </v-col>
        </v-row>
      </div>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total({{subType}})</v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{currency(sumSecondBalance(subType))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{currency(sumFirstBalance(subType))}}</p></v-col>
      </v-row>
      <hr />
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'AssetsNotes',
  props: ['accounts'],
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
