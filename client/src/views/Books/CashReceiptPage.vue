<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <CashReceipt />
    </div>
  </div>
</template>

<script>
import CashReceipt from '@/components/books/CashReceipt'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'CashReceiptPage',
  components: { CashReceipt, RestrictedResource }
}
</script>

<style scoped>

</style>
