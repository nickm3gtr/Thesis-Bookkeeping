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
      <v-list-group
        color="white"
        v-for="item in bookkeeperItems"
        :key="item.title"
        :disabled="item.disabled"
        v-model="item.active"
        :prepend-icon="item.action"
        :append-icon="!item.items ? '' : undefined"
        no-action
        @click="$router.push(item.route).catch(err => {})"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 font-weight-light" v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subItem in item.items"
          :key="subItem.title"
          :to="subItem.route"
        >
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 font-weight-light" v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </div>
    <div v-else>
      <v-list-group
        color="white"
        v-for="item in adminItems"
        :key="item.title"
        :disabled="item.disabled"
        v-model="item.active"
        :prepend-icon="item.action"
        :append-icon="!item.items ? '' : undefined"
        no-action
        @click="$router.push(item.route).catch(err => {})"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 font-weight-light" v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subItem in item.items"
          :key="subItem.title"
        >
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 font-weight-light" v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </div>
  </v-list-item-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BookkeeperNavDrawer',
  data () {
    return {
      bookkeeperItems: [
        {
          action: 'dashboard',
          title: 'Dashboard',
          route: '/bookkeeper/dashboard'
        },
        {
          action: 'event_note',
          title: 'Chart of Accounts',
          route: '/bookkeeper/chart_of_account'
        },
        {
          action: 'chrome_reader_mode',
          title: 'Bookkeeping',
          route: '#',
          items: [
            { title: 'General Journal', route: '/bookkeeper/general-journal' },
            { title: 'Cash Receipt Book', route: '#' },
            { title: 'Cash Disbursement Book', route: '#' },
            { title: 'Sales Book', route: '#' },
            { title: 'Purchase Book', route: '#' }
          ]
        }
      ],
      adminItems: [
        {
          action: 'dashboard',
          title: 'Dashboard',
          route: '/admin/dashboard'
        },
        {
          action: 'event_note',
          title: 'Chart of Accounts',
          route: '/admin/chart_of_account'
        },
        {
          action: 'local_offer',
          title: 'Transactions',
          route: '#',
          items: [
            { title: 'General Journal' },
            { title: 'Cash Receipt Book' },
            { title: 'Cash Disbursement Book' },
            { title: 'Sales Book' },
            { title: 'Purchase Book' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped></style>
