<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-row>
          <v-col cols="12" md="4">
            <SalesThisMonth />
          </v-col>
          <v-col cols="12" md="4">
            <ExpensesThisMonth />
          </v-col>
          <v-col cols="12" md="4">
            <TransactionsRecorded />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <Barchart />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <ExpenseBarChart />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Barchart from './charts/Barchart'
import ExpenseBarChart from './charts/ExpenseBarChart'
import SalesThisMonth from './dashboard/SalesThisMonth'
import ExpensesThisMonth from './dashboard/ExpensesThisMonth'
import TransactionsRecorded from './dashboard/TransactionsRecorded'

export default {
  name: 'DashboardBookkeeperComponent',
  components: {
    Barchart,
    ExpenseBarChart,
    SalesThisMonth,
    ExpensesThisMonth,
    TransactionsRecorded
  }
}
</script>

<style scoped>
</style>
