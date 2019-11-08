<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <BankComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import BankComponent from '@/components/banks/BankComponent'

export default {
  name: 'BankPage',
  components: { RestrictedResource, BankComponent }
}
</script>
