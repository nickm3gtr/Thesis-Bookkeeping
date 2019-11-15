<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account !== 'manager'">
      <RestrictedResource />
    </div>
    <div v-else>
      <ManagerVendorComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import ManagerVendorComponent from '@/components/vendors/ManagerVendorComponent'

export default {
  name: 'VendorPage',
  components: { RestrictedResource, ManagerVendorComponent }
}
</script>
