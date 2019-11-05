<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <TrialBalanceReport />
    </div>
  </div>
</template>

<script>
import TrialBalanceReport from '@/components/Reports/TrialBalanceReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'TrialBalanceReportPage',
  components: { TrialBalanceReport, RestrictedResource }
}
</script>

<style scoped>

</style>
