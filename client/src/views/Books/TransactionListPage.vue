<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <TransactionList />
    </div>
  </div>
</template>

<script>
import TransactionList from '@/components/books/TransactionList'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'TransactionListPage',
  components: { TransactionList, RestrictedResource }
}
</script>

<style scoped>

</style>
