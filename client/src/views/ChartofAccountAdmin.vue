<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated == false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminChartofAccount />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'

import AdminChartofAccount from '@/components/AdminChartofAccount'

export default {
  name: 'ChartofAccountAdmin',
  components: { AdminChartofAccount, RestrictedResource }
}
</script>

<style scoped>

</style>
