<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Profits</v-card-title>
              <v-card-text>
                <Barchart />
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

export default {
  name: 'DashboardBookkeeperComponent',
  components: { Barchart }
}
</script>

<style scoped>

</style>
