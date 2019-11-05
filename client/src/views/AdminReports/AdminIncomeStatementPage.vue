<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminIncomeStatementReport />
    </div>
  </div>
</template>

<script>
import AdminIncomeStatementReport from '@/components/Reports/AdminIncomeStatementReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminIncomeStatementPage',
  components: { AdminIncomeStatementReport, RestrictedResource }
}
</script>

<style scoped>

</style>
