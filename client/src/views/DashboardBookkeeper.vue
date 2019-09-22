<template>
  <div class="dashboard">
    <div v-if="auth === null || auth.isAuthenticated === false || auth.user.account !== 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <h1></h1>
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import { mapState } from 'vuex'

export default {
  name: 'DashboardBookkeeper',
  components: { RestrictedResource },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped></style>
