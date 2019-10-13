<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-row>
          <v-col cols="12" md="4">
            <AdminSalesThisMonth />
          </v-col>
          <v-col cols="12" md="4">
            <AdminExpensesThisMonth />
          </v-col>
          <v-col cols="12" md="4">
            <AdminTransactionsRecorded />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <AdminBarchart />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <AdminExpenseBarChart />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminBarchart from './charts/AdminBarchart'
import AdminExpenseBarChart from './charts/AdminExpenseBarChart'
import AdminSalesThisMonth from './dashboard/AdminSalesThisMonth'
import AdminExpensesThisMonth from './dashboard/AdminExpensesThisMonth'
import AdminTransactionsRecorded from './dashboard/AdminTransactionsRecorded'

export default {
  name: 'DashboardAdminComponent',
  components: {
    AdminBarchart,
    AdminExpenseBarChart,
    AdminSalesThisMonth,
    AdminExpensesThisMonth,
    AdminTransactionsRecorded
  }
}
</script>

<style scoped>
</style>
