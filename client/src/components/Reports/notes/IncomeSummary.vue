<template>
  <div>
    <div class="mx-12">
      <br>
      <v-row class="ml-10">
        <v-col cols="12" md="4"></v-col>
        <v-col cols="12" md="1">Notes</v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{bigYear}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{smallYear}}</p></v-col>
      </v-row>
      <p class="sub-title">Revenues</p>
      <div v-for="subType in filterRevenues" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4">{{subType.name}}</v-col>
          <v-col cols="12" md="1">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumSecondBalance(subType.name)}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumFirstBalance(subType.name)}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeSecondBalance(40000)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeFirstBalance(40000)}}</p></v-col>
      </v-row>
      <hr>
      <p class="sub-title">Cost of Goods Sold</p>
      <div v-for="subType in filterCogs" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4">{{subType.name}}</v-col>
          <v-col cols="12" md="1">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumSecondBalance(subType.name)}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumFirstBalance(subType.name)}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeSecondBalance(50000)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeFirstBalance(50000)}}</p></v-col>
      </v-row>
      <hr>
      <p class="sub-title">Cost of Services</p>
      <div v-for="subType in filterCoServices" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4">{{subType.name}}</v-col>
          <v-col cols="12" md="1">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumSecondBalance(subType.name)}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumFirstBalance(subType.name)}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeSecondBalance(60000)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeFirstBalance(60000)}}</p></v-col>
      </v-row>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Less: Total Direct Cost </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{totalDirectCostSecond}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{totalDirectCostFirst}}</p></v-col>
      </v-row>
      <hr>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Gross Profit </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{grossProfitSecond}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{grossProfitFirst}}</p></v-col>
      </v-row>
      <hr>
      <br>
      <p class="sub-title">Expenses</p>
      <div v-for="subType in filterExpenses" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4">{{subType.name}}</v-col>
          <v-col cols="12" md="1">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumSecondBalance(subType.name)}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right total">{{sumFirstBalance(subType.name)}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Less: Total Expenses: </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeSecondBalance(70000)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{sumAccountTypeFirstBalance(70000)}}</p></v-col>
      </v-row>
      <hr>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5">Undistributed Net Surplus </v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{netProfitSecond}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total">{{netProfitFirst}}</p></v-col>
      </v-row>
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IncomeSummary',
  props: ['accounts', 'bigYear', 'smallYear'],
  methods: {
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
    },
    sumAccountTypeFirstBalance (typeId) {
      const types = this.accounts.filter(account => {
        return account.id === typeId
      })
      const typeBalance = types.map(type => {
        return parseFloat(type.balance1)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(typeBalance)
      return parseFloat(sum).toFixed(2)
    },
    sumAccountTypeSecondBalance (typeId) {
      const types = this.accounts.filter(account => {
        return account.id === typeId
      })
      const typeBalance = types.map(type => {
        return parseFloat(type.balance2)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(typeBalance)
      return parseFloat(sum).toFixed(2)
    }
  },
  computed: {
    subTypes () {
      const subs = this.accounts.map(account => {
        const sub = {
          id: account.id,
          name: account.subtype
        }
        return sub
      })
      const uniqueSubs = subs.filter((sub, index, self) =>
        index === self.findIndex((t) => (
          t.id === sub.id && t.name === sub.name
        ))
      )
      return uniqueSubs
    },
    subTypesWithIndex () {
      const subsIndex = this.subTypes.map((sub, index) => {
        const subObj = {
          number: index + 1,
          name: sub.name,
          id: sub.id
        }
        return subObj
      })
      return subsIndex
    },
    filterRevenues () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 40000
      })
      return assets
    },
    filterCogs () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 50000
      })
      return assets
    },
    filterCoServices () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 60000
      })
      return assets
    },
    filterExpenses () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 70000
      })
      return assets
    },
    totalDirectCostFirst () {
      const cost = parseFloat(this.sumAccountTypeFirstBalance(50000)) + parseFloat(this.sumAccountTypeFirstBalance(60000))
      return parseFloat(cost).toFixed(2)
    },
    totalDirectCostSecond () {
      const cost = parseFloat(this.sumAccountTypeSecondBalance(50000)) + parseFloat(this.sumAccountTypeSecondBalance(60000))
      return parseFloat(cost).toFixed(2)
    },
    grossProfitFirst () {
      const grossProfit = parseFloat(this.sumAccountTypeFirstBalance(40000)) - parseFloat(this.totalDirectCostFirst)
      return parseFloat(grossProfit).toFixed(2)
    },
    grossProfitSecond () {
      const grossProfit = parseFloat(this.sumAccountTypeSecondBalance(40000)) - parseFloat(this.totalDirectCostSecond)
      return parseFloat(grossProfit).toFixed(2)
    },
    netProfitFirst () {
      const netProfit = parseFloat(this.grossProfitFirst) - parseFloat(this.sumAccountTypeFirstBalance(70000))
      return parseFloat(netProfit).toFixed(2)
    },
    netProfitSecond () {
      const netProfit = parseFloat(this.grossProfitSecond) - parseFloat(this.sumAccountTypeSecondBalance(70000))
      return parseFloat(netProfit).toFixed(2)
    }
  }
}
</script>
