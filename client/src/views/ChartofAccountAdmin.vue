<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth.isAuthenticated == false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <ChartOfAccount />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'

import ChartOfAccount from '@/components/ChartOfAccount'

export default {
  name: 'ChartofAccountAdmin',
  components: { ChartOfAccount, RestrictedResource }
}
</script>

<style scoped>

</style>
