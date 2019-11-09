<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <VendorComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import VendorComponent from '@/components/vendors/VendorComponent'

export default {
  name: 'VendorPage',
  components: { RestrictedResource, VendorComponent }
}
</script>
