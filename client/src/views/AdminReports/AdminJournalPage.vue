<template>
  <div>
    <div v-if="$store.state.auth.isAuthenticated == false ||
    $store.state.auth.user.account !== 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <AdminJournalReport />
    </div>
  </div>
</template>

<script>
import AdminJournalReport from '@/components/Reports/AdminJournalReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'AdminJournal',
  components: { AdminJournalReport, RestrictedResource }
}
</script>

<style scoped>

</style>
