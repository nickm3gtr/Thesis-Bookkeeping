<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth.isAuthenticated == false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <GeneralJournal />
    </div>
  </div>
</template>

<script>
import GeneralJournal from '@/components/GeneralJournal'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'GeneralJournalPage',
  components: { GeneralJournal, RestrictedResource }
}
</script>

<style scoped>

</style>
