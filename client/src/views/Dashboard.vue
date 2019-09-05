<template>
    <div class="dashboard">
      <div v-if="auth.isAuthenticated !== true">
        <RestrictedResource />
      </div>
     <div v-else>
       Dashboard
     </div>
    </div>
</template>

<script>
import RestrictedResource from '@/components/RestrictedResource'
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: { RestrictedResource },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped>

</style>
