<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <SalesBook />
    </div>
  </div>
</template>

<script>
import SalesBook from '@/components/books/SalesBook'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'SalesBookPage',
  components: { SalesBook, RestrictedResource }
}
</script>

<style scoped>

</style>
