<template>
  <div class="ledger">
    <p><span class="subtitle-2">Cost of Goods Sold</span></p>
    <div v-for="item in costOfGoods" :key="item.AccountId">
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
        <span class="subtitle-2">Total Cost of Goods Sold: </span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="costOfGoods.length<1"><span></span></p>
        <p v-else class="text-right"><span class="font-weight-medium">{{ balance }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
export default {
  name: 'CostOfGoodsSold',
  props: ['costOfGoods', 'balance']
}
</script>

<style scoped>

</style>
