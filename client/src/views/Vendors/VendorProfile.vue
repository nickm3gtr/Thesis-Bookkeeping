<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false">
      <RestrictedResource />
    </div>
    <div v-else>
      <VendorProfileComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import VendorProfileComponent from '@/components/vendors/VendorProfileComponent'

export default {
  name: 'VendorProfile',
  components: { RestrictedResource, VendorProfileComponent }
}
</script>
