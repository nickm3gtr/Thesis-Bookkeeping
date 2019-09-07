<template>
  <v-list-item-group color="white">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline text-lg-center">DARBMUPCO</v-list-item-title>
          <v-list-item-subtitle class="text-lg-center">Bookkeeping System</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="(link, i) in links" :key="i" router :to="link.route" class="my-2">
      <v-list-item-icon>
        <v-icon>
          {{ link.icon }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="subtitle-2 font-weight-light">{{ link.text }}</v-list-item-title>
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
        {
          icon: 'dashboard',
          text: 'Dashboard',
          route: '/dashboard/bookkeeper'
        },
        {
          icon: 'event_note',
          text: 'Chart of Accounts',
          route: '/chart_of_accounts/bookkeeper'
        },
        {
          icon: 'chrome_reader_mode',
          text: 'Journals',
          route: '/journal/bookkeeper'
        }
      ]
    }
  },
  computed: {
    sidebarOverlayGradiant () {
      return `'rgba(27, 27, 27, 0.74)', 'rgba(27, 27, 27, 0.74)'`
    }
  }
}
</script>

<style scoped></style>
