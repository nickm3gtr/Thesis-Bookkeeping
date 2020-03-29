<template>
  <div class="dashboard mb-12">
    <div v-if="auth === null || auth.isAuthenticated === false || auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <DashboardBookkeeperComponent />
    </div>
  </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import { mapState } from 'vuex'
import DashboardBookkeeperComponent from '@/components/DashboardBookkeeperComponent'

export default {
  name: 'DashboardBookkeeper',
  components: { RestrictedResource, DashboardBookkeeperComponent },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped></style>
