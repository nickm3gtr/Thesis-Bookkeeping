<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account !== 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminBankComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import AdminBankComponent from '@/components/banks/AdminBankComponent'

export default {
  name: 'BankPage',
  components: { RestrictedResource, AdminBankComponent }
}
</script>
