<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminTransactionList />
    </div>
  </div>
</template>

<script>
import AdminTransactionList from '@/components/books/AdminTransactionList'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminTransactionListPage',
  components: { AdminTransactionList, RestrictedResource }
}
</script>

<style scoped>

</style>
