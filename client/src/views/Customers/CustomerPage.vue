<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <CustomerComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import CustomerComponent from '@/components/customers/CustomerComponent'

export default {
  name: 'CustomerPage',
  components: { RestrictedResource, CustomerComponent }
}
</script>
