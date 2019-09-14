<template>
  <div class="ledger">
    <p><span class="subtitle-2">Current Assets</span></p>
    <div v-for="item in currentAssets" :key="item.AccountId">
      <v-row class="ml-12">
        <v-col cols="12" md="4">
          <span class="font-weight-medium">{{ item.name }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <span class="font-weight-medium">{{ item.debit }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <span class="font-weight-medium">{{ item.credit }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <span class="font-weight-medium">{{ item.balance }}</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrentAssetsLedger',
  props: ['currentAssets']
}
</script>

<style scoped>

</style>
