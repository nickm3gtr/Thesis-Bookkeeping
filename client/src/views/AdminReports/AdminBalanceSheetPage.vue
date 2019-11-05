<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminBalanceSheetReport />
    </div>
  </div>
</template>

<script>
import AdminBalanceSheetReport from '@/components/Reports/AdminBalanceSheetReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminBalanceSheetPage',
  components: { AdminBalanceSheetReport, RestrictedResource }
}
</script>

<style scoped>

</style>
