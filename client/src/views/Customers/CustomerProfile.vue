<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false">
      <RestrictedResource />
    </div>
    <div v-else>
      <CustomerProfileComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import CustomerProfileComponent from '@/components/customers/CustomerProfileComponent'

export default {
  name: 'CustomerProfile',
  components: { RestrictedResource, CustomerProfileComponent }
}
</script>
