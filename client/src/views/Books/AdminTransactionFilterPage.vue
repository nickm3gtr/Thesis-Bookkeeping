<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminTransactionFilter />
    </div>
  </div>
</template>

<script>
import AdminTransactionFilter from '@/components/books/AdminTransactionFilter'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminTransactionFilterPage',
  components: { AdminTransactionFilter, RestrictedResource }
}
</script>

<style scoped>

</style>
