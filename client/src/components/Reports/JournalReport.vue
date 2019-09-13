<template>
  <div class="journal-report">
    <v-layout>
      <v-flex sm12 md12>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="4">
                <v-menu
                  ref="fromMenu"
                  v-model="fromMenu"
                  :close-on-content-click="false"
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
                  <v-date-picker
                    no-title
                    v-model="fromDate"
                    @input="fromMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                  ref="toMenu"
                  v-model="toMenu"
                  :close-on-content-click="false"
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
                  <v-date-picker
                    no-title
                    v-model="toDate"
                    @input="toMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4" class="mt-3">
                <v-btn dark color="primary" class="mx-2" @click="generate">Generate</v-btn>
                <v-btn dark color="success" class="mx-2" @click="pdf">Print</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <div ref="content">
            <v-card-text>
              <v-data-table
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
                      <span v-else>{{ item.date }}</span>
                    </td>
                    <td>
                      <span v-if="item.debit === null"></span>
                      <span v-else>{{ item.memo }}</span>
                    </td>
                    <td>
                      <span v-if="item.debit === null">&emsp;{{ item.Account.name }}</span>
                      <span v-else>{{ item.Account.name }}</span>
                    </td>
                    <td class="text-right">{{ item.debit }}</td>
                    <td class="text-right">{{ item.credit }}</td>
                  </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'JournalReport',
  data () {
    return {
      fromMenu: false,
      toMenu: false,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      headers: [
        { text: 'Date', value: 'date', width: '20%' },
        { text: 'Memo', value: 'memo', width: '30%' },
        { text: 'AccountId', value: 'Account.name', width: '20%' },
        { text: 'Debit', value: 'debit', width: '15%' },
        { text: 'Credit', value: 'credit', width: '15%' }
      ],
      items: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async generate () {
      try {
        const response = await axios.get(
          `/api/reports/journal/${this.fromDate}/${this.toDate}`
        )
        this.items = response.data
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    pdf () {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      doc.autoTable({ html: this.$refs['content'] })
      console.log(this.$refs['content'])
      doc.save('table.pdf')
    }
  }
}
</script>

<style scoped></style>
