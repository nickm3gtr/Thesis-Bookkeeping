<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'bookkeeper'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminNotesReport />
    </div>
  </div>
</template>

<script>
import AdminNotesReport from '@/components/Reports/AdminNotesReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminNotesPage',
  components: { AdminNotesReport, RestrictedResource }
}
</script>
