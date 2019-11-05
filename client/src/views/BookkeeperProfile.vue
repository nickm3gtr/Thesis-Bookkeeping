<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <BookkeeperProfileComponent />
    </div>
  </div>
</template>

<script>
import BookkeeperProfileComponent from '@/components/profile/BookkeeperProfileComponent'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'BookkeeperProfile',
  components: { BookkeeperProfileComponent, RestrictedResource }
}
</script>
