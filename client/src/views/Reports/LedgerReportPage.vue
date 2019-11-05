<template>
    <div>
      <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
        <RestrictedResource />
      </div>
      <div v-else>
        <LedgerReport />
      </div>
  </div>
</template>

<script>
import LedgerReport from '@/components/Reports/LedgerReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'LedgerReportPage',
  components: { LedgerReport, RestrictedResource }
}
</script>

<style scoped>

</style>
