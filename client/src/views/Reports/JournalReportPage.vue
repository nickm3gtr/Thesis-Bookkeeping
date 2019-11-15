<template>
  <div>
    <div v-if="$store.state.auth.isAuthenticated == false ||
    $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <JournalReport />
    </div>
  </div>
</template>

<script>
import JournalReport from '@/components/Reports/JournalReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'JournalReportPage',
  components: { JournalReport, RestrictedResource }
}
</script>

<style scoped>

</style>
