<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <DistributeReport />
    </div>
  </div>
</template>

<script>
import DistributeReport from '@/components/Reports/DistributeReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'DistributePage',
  components: { DistributeReport, RestrictedResource }
}
</script>

<style scoped>

</style>
