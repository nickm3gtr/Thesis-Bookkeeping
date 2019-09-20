<template>
  <div class="text-center ma-12 mt-12">
    <v-overlay
      v-if="auth.isLoading"
      :value="!overlay"
    >
    </v-overlay>
    <v-progress-circular
      v-if="auth.isLoading"
      size="90"
      width="10"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <h1></h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeAdmin',
  data () {
    return {
      overlay: false
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped></style>
