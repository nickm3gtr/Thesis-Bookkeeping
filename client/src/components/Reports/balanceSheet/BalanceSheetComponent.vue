<template>
  <div class="ml-12">
    <div v-for="item in accounts" :key="item.id">
      <v-row>
        <v-col cols="12" md="5">
          <span>{{ item.subtype }}</span>
        </v-col>
        <v-col cols="12" md="4">
          <span>{{ item.account }}</span>
        </v-col>
        <v-col cols="12" md="3">
          <p class="text-right"><span>{{ item.balance }}</span></p>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col cols="12" md="5">
        <span class="font-weight-medium">{{ msg }}</span>
      </v-col>
      <v-col cols="12" md="4">
        <span></span>
      </v-col>
      <v-col cols="12" md="3">
        <p class="text-right"><span class="font-weight-medium">{{ formatBalance(total) }}</span></p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BalanceSheetComponent',
  props: ['accounts', 'total', 'msg'],
  methods: {
    formatBalance (val) {
      return parseFloat(val).toFixed(2)
    }
  }
}
</script>

<style scoped>

</style>
