<template>
  <div class="ledger">
    <p><span class="subtitle-2">Current Assets</span></p>
    <div v-for="(item, index) in currentAssets" :key="index">
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
          <p class="text-right"><span class="font-weight-medium">{{ currency(item.balance) }}</span></p>
        </v-col>
      </v-row>
    </div>
    <hr>
    <v-row class="ml-12">
      <v-col cols="12" md="8">
        <span class="subtitle-2">Total Current Assets:</span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="currentAssets.length<1"><span></span></p>
        <p v-else class="text-right"><span class="font-weight-medium">{{ currency(balance) }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'CurrentAssetsLedger',
  props: ['currentAssets', 'balance'],
  methods: {
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
