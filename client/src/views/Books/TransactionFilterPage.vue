<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <TransactionFilter />
    </div>
  </div>
</template>

<script>
import TransactionFilter from '@/components/books/TransactionFilter'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'TransactionFilterPage',
  components: { TransactionFilter, RestrictedResource }
}
</script>

<style scoped>

</style>
