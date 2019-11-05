<template>
  <div>
    <div class="not-authenticated" v-if="$store.state.auth === null || $store.state.auth.isAuthenticated === false || $store.state.auth.user.account === 'admin'">
      <RestrictedResource />
    </div>
    <div v-else>
      <NotesReport />
    </div>
  </div>
</template>

<script>
import NotesReport from '@/components/Reports/NotesReport'
import RestrictedResource from '@/components/RestrictedResource'

export default {
  name: 'NotesPage',
  components: { NotesReport, RestrictedResource }
}
</script>
