<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <div v-if="$store.state.auth.user.account === 'manager'">
        <VendorComponent />
      </div>
      <div v-else-if="$store.state.auth.user.account === 'admin'">
        <AdminVendorComponent />
      </div>
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import VendorComponent from '@/components/vendors/VendorComponent'
import AdminVendorComponent from '@/components/vendors/AdminVendorComponent'

export default {
  name: 'VendorPage',
  components: { RestrictedResource, VendorComponent, AdminVendorComponent }
}
</script>
