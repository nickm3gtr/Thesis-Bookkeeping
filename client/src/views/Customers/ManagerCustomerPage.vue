<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account !== 'manager'">
      <RestrictedResource />
    </div>
    <div v-else>
      <ManagerCustomerComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import ManagerCustomerComponent from '@/components/customers/ManagerCustomerComponent'

export default {
  name: 'CustomerPage',
  components: { RestrictedResource, ManagerCustomerComponent }
}
</script>
