<template>
  <div class="ledger">
    <p><span class="subtitle-2">Non Current Assets</span></p>
    <div v-for="item in nonCurrentAssets" :key="item.AccountId">
      <v-row class="ml-12">
        <v-col cols="12" md="4">
          <span class="font-weight-medium">{{ item.name }}</span>
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
        <span class="subtitle-2">Total Non-Current Assets: </span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="nonCurrentAssets.length<1"><span></span></p>
      <p v-else class="text-right"><span class="font-weight-medium">{{ currency(balance) }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'NonCurrentAssets',
  props: ['nonCurrentAssets', 'balance'],
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
