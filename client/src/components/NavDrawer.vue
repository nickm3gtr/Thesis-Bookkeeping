<template>
  <v-list-item-group color="white">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline text-lg-center">DARBMUPCO</v-list-item-title>
          <v-list-item-subtitle class="text-lg-center">Bookkeeping System</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    <v-divider></v-divider>
    <div v-if="auth.user.account === 'bookkeeper'">
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
    </div>
    <div v-else>
      <v-list-item v-for="(link, i) in adminLinks" :key="i" router :to="link.route" class="my-2">
        <v-list-item-icon>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="subtitle-2 font-weight-light">{{ link.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list-item-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BookkeeperNavDrawer',
  data () {
    return {
      links: [
        {
          icon: 'dashboard',
          text: 'Dashboard',
          route: '/bookkeeper/dashboard'
        },
        {
          icon: 'event_note',
          text: 'Chart of Accounts',
          route: '/bookkeeper/chart_of_account'
        },
        {
          icon: 'chrome_reader_mode',
          text: 'Journals',
          route: '/journal/bookkeeper'
        }
      ],
      adminLinks: [
        {
          icon: 'dashboard',
          text: 'Dashboard',
          route: '/admin/dashboard'
        },
        {
          icon: 'event_note',
          text: 'Chart of Accounts',
          route: '/admin/chart_of_account'
        }
      ]
    }
  },
  computed: {
    ...mapState(['auth']),
    sidebarOverlayGradiant () {
      return `'rgba(27, 27, 27, 0.74)', 'rgba(27, 27, 27, 0.74)'`
    }
  }
}
</script>

<style scoped></style>
