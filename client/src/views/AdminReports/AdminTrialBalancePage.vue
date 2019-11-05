<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminTrialBalanceReport />
    </div>
  </div>
</template>

<script>
import AdminTrialBalanceReport from '@/components/Reports/AdminTrialBalanceReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminTrialBalancePage',
  components: { AdminTrialBalanceReport, RestrictedResource }
}
</script>

<style scoped>

</style>
