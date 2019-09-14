<template>
  <div class="ledger">
    <p><span class="subtitle-2">Cost of Services</span></p>
    <div v-for="item in costOfServices" :key="item.AccountId">
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
    <hr>
    <v-row class="ml-12">
      <v-col cols="12" md="8">
        <span class="subtitle-2">Total Cost of Services: </span>
      </v-col>
      <v-col cols="12" md="2">
        <span v-if="costOfServices.length<1"></span>
        <span v-else class="font-weight-medium">{{ balance }}</span>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
export default {
  name: 'CostOfServices',
  props: ['costOfServices', 'balance']
}
</script>

<style scoped>

</style>
