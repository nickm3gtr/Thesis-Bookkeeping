<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'|| $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <ManagerTransactionList />
    </div>
  </div>
</template>

<script>
import ManagerTransactionList from '@/components/books/ManagerTransactionList'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminTransactionListPage',
  components: { ManagerTransactionList, RestrictedResource }
}
</script>

<style scoped>

</style>
