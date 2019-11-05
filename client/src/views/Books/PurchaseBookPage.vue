<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <PurchaseBook />
    </div>
  </div>
</template>

<script>
import PurchaseBook from '@/components/books/PurchaseBook'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'PurchaseBookPage',
  components: { PurchaseBook, RestrictedResource }
}
</script>

<style scoped>

</style>
