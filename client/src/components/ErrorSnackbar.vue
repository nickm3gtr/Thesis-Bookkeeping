<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :multi-line="multiline"
      bottom="bottom"
      color="red lighten-1"
      :timeout="timeout"
    >
      {{ text }}
      <v-btn
        color="white"
        text
        @click="close"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ErrorSnackbar',
  props: [ 'snackbar', 'text' ],
  data () {
    return {
      multiline: true,
      timeout: 2000
    }
  },
  methods: {
    ...mapActions('errors', ['clearError']),
    close () {
      this.clearError()
    }
  }
}
</script>

<style scoped>

</style>
