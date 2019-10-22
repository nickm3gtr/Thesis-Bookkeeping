<template>
  <div class="mx-12">
    <div v-for="(subType, index) in subTypes" :key="index">
      <span>{{subType}}</span>
      <div v-for="item in accounts" :key="item.account_id">
        <v-row class="ml-10">
          <v-col cols="12" md="5" v-if="item.subtype === subType">{{item.account}}</v-col>
          <v-col cols="12" md="3" v-if="item.subtype === subType"><p class="text-right">{{formatBalance(item.balance)}}</p></v-col>
        </v-row>
      </div>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total({{subType}})</v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sum(subType)}}</p></v-col>
      </v-row>
      <hr />
    </div>
    <v-row>
      <v-col cols="12" md="7">
        <span>{{ msg }}</span>
      </v-col>
      <v-col cols="12" md="3">
        <p class="text-right type-total"><span>{{ formatBalance(total) }}</span></p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ExpenseComponent',
  props: ['accounts', 'total', 'msg'],
  methods: {
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

 .font-weight-medium {
   font-size: 12px;
   color: black;
 }
</style>
