<template>
  <div>
    <div class="mx-12">
      <br>
      <p class="text-center sub-title font-weight-bold small">ASSETS</p>
      <v-row class="ml-10">
        <v-col cols="12" md="4"></v-col>
        <v-col cols="12" md="1" class="small">Notes</v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{bigYear}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{smallYear}}</p></v-col>
      </v-row>
      <p class="sub-title small">Current Assets</p>
      <div v-for="subType in filterCurrentAssets" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4" class="x-small">{{subType.name}}</v-col>
          <v-col cols="12" md="1" class="x-small">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumSecondBalance(subType.name))}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumFirstBalance(subType.name))}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right total right x-small">{{currency(sumAccountTypeSecondBalance(11000))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right total right x-small">{{currency(sumAccountTypeFirstBalance(11000))}}</p></v-col>
      </v-row>
      <hr>
      <p class="sub-title small">Non-Current Assets</p>
      <div v-for="subType in filterNonCurrentAssets" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4">{{subType.name}}</v-col>
          <v-col cols="12" md="1">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumSecondBalance(subType.name))}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumFirstBalance(subType.name))}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeSecondBalance(13000))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeFirstBalance(13000))}}</p></v-col>
      </v-row>
      <hr>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">TOTAL ASSETS: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalAssetsSecond)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalAssetsFirst)}}</p></v-col>
      </v-row>
      <hr>
      <br>
      <p class="text-center sub-title font-weight-bold small">LIABILITIES RESERVES AND MEMBERS EQUITY</p>
      <p class="sub-title small">Current Liabilities</p>
      <div v-for="subType in filterCurrentLiabilities" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4" class="x-small">{{subType.name}}</v-col>
          <v-col cols="12" md="1" class="x-small">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumSecondBalance(subType.name))}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumFirstBalance(subType.name))}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeSecondBalance(21000))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeFirstBalance(21000))}}</p></v-col>
      </v-row>
      <hr>
      <p class="sub-title small">Non-Current Liabilities</p>
      <div v-for="subType in filterNonCurrentLiabilities" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4" class="x-small">{{subType.name}}</v-col>
          <v-col cols="12" md="1" class="x-small">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumSecondBalance(subType.name))}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumFirstBalance(subType.name))}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeSecondBalance(22000))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeFirstBalance(22000))}}</p></v-col>
      </v-row>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">TOTAL LIABILITIES: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalLiabilitiesSecond)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalLiabilitiesFirst)}}</p></v-col>
      </v-row>
      <hr>
      <p class="sub-title small">Member's Equity and Reserves</p>
      <div v-for="subType in filterEquity" :key="subType.number">
        <v-row class="ml-10">
          <v-col cols="12" md="4" class="x-small">{{subType.name}}</v-col>
          <v-col cols="12" md="1" class="x-small">{{subType.number}}</v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumSecondBalance(subType.name))}}</p></v-col>
          <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumFirstBalance(subType.name))}}</p></v-col>
        </v-row>
      </div>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Total: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeSecondBalance(30100))}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(sumAccountTypeFirstBalance(30100))}}</p></v-col>
      </v-row>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">Undistributed Net Surplus: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(netProfitSecond)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(netProfitFirst)}}</p></v-col>
      </v-row>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">TOTAL EQUITY: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalEquitySecond)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalEquityFirst)}}</p></v-col>
      </v-row>
      <hr>
      <hr>
      <v-row class="ml-10">
        <v-col cols="12" md="5" class="x-small">TOTAL LIABILITIES, EQUITY & RESERVES: </v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalLiabilitiesEquitySecond)}}</p></v-col>
        <v-col cols="12" md="3"><p class="text-right right x-small total">{{currency(totalLiabilitiesEquityFirst)}}</p></v-col>
      </v-row>
      <hr>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'BalanceSummary',
  props: ['accounts', 'profits', 'bigYear', 'smallYear', 'checkFirst', 'checkSecond'],
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
    },
    sumAccountTypeFirstProfit (typeId) {
      const types = this.profits.filter(account => {
        return account.id === typeId
      })
      const typeBalance = types.map(type => {
        return parseFloat(type.balance1)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(typeBalance)
      return parseFloat(sum).toFixed(2)
    },
    sumAccountTypeSecondProfit (typeId) {
      const types = this.profits.filter(account => {
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
    filterCurrentAssets () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 11000
      })
      return assets
    },
    filterNonCurrentAssets () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 13000
      })
      return assets
    },
    filterCurrentLiabilities () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 21000
      })
      return assets
    },
    filterNonCurrentLiabilities () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 22000
      })
      return assets
    },
    filterEquity () {
      const assets = this.subTypesWithIndex.filter(sub => {
        return sub.id === 30100
      })
      return assets
    },
    totalAssetsFirst () {
      const assets = parseFloat(this.sumAccountTypeFirstBalance(11000)) + parseFloat(this.sumAccountTypeFirstBalance(13000))
      return parseFloat(assets).toFixed(2)
    },
    totalAssetsSecond () {
      const assets = parseFloat(this.sumAccountTypeSecondBalance(11000)) + parseFloat(this.sumAccountTypeSecondBalance(13000))
      return parseFloat(assets).toFixed(2)
    },
    totalLiabilitiesFirst () {
      const assets = parseFloat(this.sumAccountTypeFirstBalance(21000)) + parseFloat(this.sumAccountTypeFirstBalance(22000))
      return parseFloat(assets).toFixed(2)
    },
    totalLiabilitiesSecond () {
      const assets = parseFloat(this.sumAccountTypeSecondBalance(21000)) + parseFloat(this.sumAccountTypeSecondBalance(22000))
      return parseFloat(assets).toFixed(2)
    },
    totalEquityFirst () {
      const total = parseFloat(this.sumAccountTypeFirstBalance(30100)) + parseFloat(this.netProfitFirst)
      return parseFloat(total).toFixed(2)
    },
    totalEquitySecond () {
      const total = parseFloat(this.sumAccountTypeSecondBalance(30100)) + parseFloat(this.netProfitSecond)
      return parseFloat(total).toFixed(2)
    },
    totalLiabilitiesEquityFirst () {
      const total = parseFloat(this.totalEquityFirst) + parseFloat(this.totalLiabilitiesFirst)
      return parseFloat(total).toFixed(2)
    },
    totalLiabilitiesEquitySecond () {
      const total = parseFloat(this.totalEquitySecond) + parseFloat(this.totalLiabilitiesSecond)
      return parseFloat(total).toFixed(2)
    },
    netProfitFirst () {
      if (this.checkFirst.length > 0) {
        return parseFloat(0).toFixed(2)
      } else {
        const gross = parseFloat(this.sumAccountTypeFirstProfit(40000)) - (parseFloat(this.sumAccountTypeFirstProfit(50000)) + parseFloat(this.sumAccountTypeFirstProfit(60000)))
        const net = parseFloat(gross) - parseFloat(this.sumAccountTypeFirstProfit(70000))
        return parseFloat(net).toFixed(2)
      }
    },
    netProfitSecond () {
      if (this.checkSecond.length > 0) {
        return parseFloat(0).toFixed(2)
      } else {
        const gross = parseFloat(this.sumAccountTypeSecondProfit(40000)) - (parseFloat(this.sumAccountTypeSecondProfit(50000)) + parseFloat(this.sumAccountTypeSecondProfit(60000)))
        const net = parseFloat(gross) - parseFloat(this.sumAccountTypeSecondProfit(70000))
        return parseFloat(net).toFixed(2)
      }
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
