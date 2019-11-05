<template>
    <div>
      <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
        <RestrictedResource />
      </div>
      <div v-else>
        <AdminLedgerReport />
      </div>
  </div>
</template>

<script>
import AdminLedgerReport from '@/components/Reports/AdminLedgerReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminLedgerPage',
  components: { AdminLedgerReport, RestrictedResource }
}
</script>

<style scoped>

</style>
