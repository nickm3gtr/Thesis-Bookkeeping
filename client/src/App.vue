<template>
  <v-app>
    <Navbar />
    <v-content class="view-container">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
// import RestrictedResource from "@/components/RestrictedResource"
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: { Navbar },
  computed: {
    ...mapState(['auth'])
  },
  beforeCreate () {
    this.$store.dispatch('auth/loadUser')
  }
}
</script>
<style>
.view-container {
  background-color: #f4f5f8;
}
</style>
