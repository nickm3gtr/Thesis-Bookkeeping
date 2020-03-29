<template>
  <div>
    <v-footer
      color="blue-grey darken-1"
      padless
    >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-col
        class="blue-grey lighten-2 py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>DARBMUPCO</strong>
      </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      links: [
        'Home',
        'About Us',
        'Contact Us'
      ]
    }
  }
}
</script>
