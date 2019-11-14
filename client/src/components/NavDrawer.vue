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
    <div v-else-if="auth.user.account === 'admin'">
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
          :to="subItem.route"
        >
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 font-weight-light" v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </div>
    <div v-else-if="auth.user.account === 'manager'">
      <v-list-group
        color="white"
        v-for="item in managerItems"
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
          action: 'account_balance',
          title: 'Bank',
          route: '/bookkeeper/banks'
        },
        {
          action: 'people_alt',
          title: 'Customers',
          route: '/bookkeeper/customers'
        },
        {
          action: 'store_mall_directory',
          title: 'Vendors',
          route: '/bookkeeper/vendors'
        },
        {
          action: 'event_note',
          title: 'Chart of Accounts',
          route: '/bookkeeper/chart_of_account'
        },
        {
          action: 'chrome_reader_mode',
          title: 'Bookkeeping',
          items: [
            { title: 'General Journal Book', route: '/bookkeeper/general-journal' },
            { title: 'Cash Receipt Book', route: '/bookkeeper/cash-receipt' },
            { title: 'Cash Disbursement Book', route: '/bookkeeper/cash-disbursement' },
            { title: 'Sales Book', route: '/bookkeeper/sales-book' },
            { title: 'Purchase Book', route: '/bookkeeper/purchase-book' }
          ]
        },
        {
          action: 'local_atm',
          title: 'Transactions',
          route: '/bookkeeper/transactions'
        },
        {
          action: 'bar_chart',
          title: 'Reports',
          items: [
            { title: 'Journal', route: '/bookkeeper/reports/journal' },
            { title: 'Ledger', route: '/bookkeeper/reports/ledger' },
            { title: 'Trial Balance', route: '/bookkeeper/reports/trial-balance' },
            { title: 'Income Statement', route: '/bookkeeper/reports/income-statement' },
            { title: 'Balance Sheet', route: '/bookkeeper/reports/balance-sheet' },
            { title: 'Year-End', route: '/bookkeeper/reports/summary' }
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
          action: 'group',
          title: 'Bookkeepers',
          route: '/admin/bookkeepers'
        },
        {
          action: 'supervisor_account',
          title: 'Managers',
          route: '/admin/managers'
        },
        {
          action: 'event_note',
          title: 'Chart of Accounts',
          route: '/admin/chart_of_account'
        },
        {
          action: 'local_atm',
          title: 'Transactions',
          route: '/admin/transactions'
        },
        {
          action: 'bar_chart',
          title: 'Reports',
          items: [
            { title: 'Journal', route: '/admin/reports/journal' },
            { title: 'Ledger', route: '/admin/reports/ledger' },
            { title: 'Trial Balance', route: '/admin/reports/trial-balance' },
            { title: 'Income Statement', route: '/admin/reports/income-statement' },
            { title: 'Balance Sheet', route: '/admin/reports/balance-sheet' },
            { title: 'Year-End', route: '/admin/reports/summary' }
          ]
        }
      ],
      managerItems: [
        {
          action: 'dashboard',
          title: 'Dashboard',
          route: '/bookkeeper/dashboard'
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
