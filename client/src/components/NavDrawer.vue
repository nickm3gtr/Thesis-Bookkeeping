<template>
  <v-list-item-group color="white">
    <v-list-item v-for="(link, i) in links" :key="i" router :to="link.route">
      <v-list-item-icon>
        <v-icon>
          {{ link.icon }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="link.text"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script>

export default {
  name: 'BookkeeperNavDrawer',
  data () {
    return {
      links: [
        { icon: 'dashboard', text: 'Dashboard', route: '/dashboard/bookkeeper' },
        { icon: 'event_note', text: 'Chart of Accounts', route: '/chart_of_accounts/bookkeeper' },
        { icon: 'chrome_reader_mode', text: 'Journals', route: '/journal/bookkeeper' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
