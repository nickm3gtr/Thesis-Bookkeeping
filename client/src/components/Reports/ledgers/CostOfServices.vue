<template>
  <div class="ledger">
    <p><span class="subtitle-2">Cost of Services</span></p>
    <div v-for="(item, index) in costOfServices" :key="index">
      <v-row class="ml-12">
        <v-col cols="12" md="4">
          <span v-if="!item.sub" class="font-weight-medium">{{ item.name }}</span>
          <span v-else-if="!item.sub.sub" class="caption font-weight-medium">{{ item.name }}:{{item.sub.name}}</span>
          <span v-else-if="item.sub.sub" class="caption font-weight-medium">{{ item.name }}:{{item.sub.name}}:{{item.sub.sub}}</span>
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
        <span class="subtitle-2">Total Cost of Services: </span>
      </v-col>
      <v-col cols="12" md="2">
        <p v-if="costOfServices.length<1"><span></span></p>
        <p v-else class="text-right"><span class="font-weight-medium">{{ currency(balance) }}</span></p>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'CostOfServices',
  props: ['costOfServices', 'balance'],
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
