<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <IncomeStatementReport />
    </div>
  </div>
</template>

<script>
import IncomeStatementReport from '@/components/Reports/IncomeStatementReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'IncomeStatementPage',
  components: { IncomeStatementReport, RestrictedResource }
}
</script>

<style scoped>

</style>
