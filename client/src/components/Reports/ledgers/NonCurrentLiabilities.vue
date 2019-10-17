<template>
  <div class="ledger">
    <p><span class="subtitle-2">Non Current Liabilities</span></p>
    <div v-for="item in nonCurrentLiabilities" :key="item.AccountId">
      <v-row class="ml-12">
        <v-col cols="12" md="4">
          <span class="font-weight-medium">{{ item.name }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ item.debit }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ item.credit }}</span></p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="text-right"><span class="font-weight-medium">{{ formatBalance(item.balance) }}</span></p>
        </v-col>
      </v-row>
    </div>
    <hr>
    <v-row class="ml-12">
      <v-col cols="12" md="8">
        <span class="subtitle-2">Total Non Current Liabilities: </span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="nonCurrentLiabilities.length<1"><span></span></p>
        <p v-else class="text-right"><span class="font-weight-medium">{{ formatBalance(balance) }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
export default {
  name: 'NonCurrentLiabilities',
  props: ['nonCurrentLiabilities', 'balance'],
  methods: {
    // Method to reverse the integer
    formatBalance (val) {
      const balance = parseFloat(val) * -1
      return parseFloat(balance).toFixed(2)
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
