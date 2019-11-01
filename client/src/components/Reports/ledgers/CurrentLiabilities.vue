<template>
  <div class="ledger">
    <p><span class="subtitle-2">Current Liabilities</span></p>
    <div v-for="(item, index) in currentLiabilities" :key="index">
      <v-row class="ml-12">
        <v-col cols="12" md="4">
          <span v-if="!item.sub" class="font-weight-medium">{{ item.name }}</span>
          <span v-else class="font-weight-medium">{{ item.name }}:{{item.sub.name}}</span>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ currency(item.debit) }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ currency(item.credit) }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ currency(formatBalance(item.balance)) }}</span></p>
        </v-col>
      </v-row>
    </div>
    <hr>
    <v-row class="ml-12">
      <v-col cols="12" md="8">
        <span class="subtitle-2">Total Current Liabilities: </span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="currentLiabilities.length<1"><span></span></p>
        <p v-else class="text-right"><span class="font-weight-medium">{{ currency(formatBalance(balance)) }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'CurrentLiabilities',
  props: ['currentLiabilities', 'balance'],
  methods: {
    // Method to reverse the integer
    formatBalance (val) {
      const balance = parseFloat(val) * -1
      return parseFloat(balance).toFixed(2)
    },
    currency (value) {
      return numeral(value).format('0,0.00')
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
