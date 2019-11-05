<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <BookkeeperAdmin />
    </div>
  </div>
</template>

<script>
import BookkeeperAdmin from '@/components/BookkeeperAdmin'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'BookkeepersAdmin',
  components: { BookkeeperAdmin, RestrictedResource }
}
</script>

<style scoped>

</style>
