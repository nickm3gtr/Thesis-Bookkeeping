<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'manager'">
      <RestrictedResource />
    </div>
    <div v-else>
      <div v-if="$store.state.auth.user.account === 'bookkeeper'">
        <CustomerComponent />
      </div>
      <div v-else-if="$store.state.auth.user.account === 'admin'">
        <AdminCustomerComponent />
      </div>
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import CustomerComponent from '@/components/customers/CustomerComponent'
import AdminCustomerComponent from '@/components/customers/AdminCustomerComponent'

export default {
  name: 'CustomerPage',
  components: { RestrictedResource, CustomerComponent, AdminCustomerComponent }
}
</script>
