<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <CashDisbursement />
    </div>
  </div>
</template>

<script>
import CashDisbursement from '@/components/books/CashDisbursement'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'CashDisbursementPage',
  components: { CashDisbursement, RestrictedResource }
}
</script>

<style scoped>

</style>
