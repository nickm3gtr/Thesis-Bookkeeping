<template>
  <div class="journal-report">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="4">
                <v-menu
                  ref="fromMenu"
                  v-model="fromMenu"
                  :close-on-content-click="false"
                  :return-value.sync="fromDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fromDate"
                      label="From"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="fromDate" no-title scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="fromMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.fromMenu.save(fromDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                  ref="toMenu"
                  v-model="toMenu"
                  :close-on-content-click="false"
                  :return-value.sync="toDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="toDate"
                      label="To"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="toDate" no-title scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="toMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="$refs.toMenu.save(toDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="2" class="mt-3">
                <v-btn dark color="primary" @click="generate">Generate</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-data-table
              dense
              hide-default-footer
              disable-sort
              sort-by="items.id"
              :headers="headers"
              :items="items"
              no-data-text="Add General Journal transactions"
              class="elevation-3"
            >
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.id">
                    <td>
                      <span v-if="item.debit === null"></span>
                      <span v-else>{{ item.TransId }}</span>
                    </td>
                    <td>
                      <span v-if="item.debit === null"></span>
                      <span v-else>{{ item.date }}</span>
                    </td>
                    <td>
                      <span v-if="item.debit === null"></span>
                      <span v-else>{{ item.memo }}</span>
                    </td>
                    <td>{{ item.Account.name }}</td>
                    <td class="text-right">{{ item.debit }}</td>
                    <td class="text-right">{{ item.credit }}</td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'JournalReport',
  data () {
    return {
      fromMenu: false,
      toMenu: false,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      headers: [
        { text: 'Trans Id', value: 'TransId' },
        { text: 'Date', value: 'date' },
        { text: 'Memo', value: 'memo' },
        { text: 'AccountId', value: 'Account.name' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ],
      items: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async generate () {
      try {
        const response = await axios.get(`/api/reports/journal/${this.fromDate}/${this.toDate}`)
        this.items = response.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  }
}
</script>

<style scoped></style>
