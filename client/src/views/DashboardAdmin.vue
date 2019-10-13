<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <DashboardAdminComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import DashboardAdminComponent from '@/components/DashboardAdminComponent'

export default {
  name: 'DashboardAdmin',
  components: { RestrictedResource, DashboardAdminComponent }
}
</script>

<style scoped>

</style>
