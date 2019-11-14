<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper' || $store.state.auth.user.account === 'manager'">
      <RestrictedResource />
    </div>
    <div v-else>
      <ManagerAdmin />
    </div>
  </div>
</template>

<script>
import ManagerAdmin from '@/components/ManagerAdmin'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'BookkeepersAdmin',
  components: { ManagerAdmin, RestrictedResource }
}
</script>

<style scoped>

</style>
