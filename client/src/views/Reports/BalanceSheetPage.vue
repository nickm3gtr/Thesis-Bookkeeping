<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <BalanceSheetReport />
    </div>
  </div>
</template>

<script>
import BalanceSheetReport from '@/components/Reports/BalanceSheetReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'BalanceSheetPage',
  components: { BalanceSheetReport, RestrictedResource }
}
</script>

<style scoped>

</style>
