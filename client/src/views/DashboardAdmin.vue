<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'DashboardAdmin',
  components: { RestrictedResource }
}
</script>

<style scoped>

</style>
