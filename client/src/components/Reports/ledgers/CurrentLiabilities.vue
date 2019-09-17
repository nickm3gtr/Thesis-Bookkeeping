<template>
  <div class="ledger">
    <p><span class="subtitle-2">Current Liabilities</span></p>
    <div v-for="item in currentLiabilities" :key="item.AccountId">
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
          <p class="text-right"><span class="font-weight-medium">{{ item.balance }}</span></p>
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
        <p v-else class="text-right"><span class="font-weight-medium">{{ balance }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
export default {
  name: 'CurrentLiabilities',
  props: ['currentLiabilities', 'balance']
}
</script>

<style scoped>

</style>
