<template>
  <div id="journal" class="journal-report">
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
                <v-btn dark color="success" class="mx-2" @click="pdf">Download PDF</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <div id="content" class="mx-12">
            <v-card-text>
              <div class="text-center">
                <p>
                  <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                  <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
                </p>
                <p><span class="subtitle-1">Transaction Journal</span></p>
                <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
                <hr>
              </div>
              <v-row class="ml-4">
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Date</span>
                </v-col>
                <v-col cols="12" md="3">
                  <span class="font-weight-medium">Memo</span>
                </v-col>
                <v-col cols="12" md="3">
                  <span class="font-weight-medium">Account</span>
                </v-col>
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Debit</span>
                </v-col>
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Credit</span>
                </v-col>
              </v-row>
              <hr>
              <div v-for="item in formatItems" :key="item.id">
                <v-row>
                  <v-col cols="12" md="2">
                    <span v-if="item.debit === null"></span>
                    <span class="body-2 font-weight-medium" v-else>{{ item.date }}</span>
                  </v-col>
                  <v-col cols="12" md="3">
                    <span v-if="item.debit === null"></span>
                    <span class="body-2 font-weight-medium" v-else>{{ item.memo }}</span>
                  </v-col>
                  <v-col cols="12" md="3">
                    <span class="body-2 font-weight-medium">{{ item.accountname }}</span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <span class="body-2 font-weight-medium">{{ item.debit }}</span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <span class="body-2 font-weight-medium">{{ item.credit }}</span>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import html2pdf from 'html2pdf.js'
// eslint-disable-next-line no-unused-vars
import jsPDF from 'jspdf'
// eslint-disable-next-line no-unused-vars
import html2canvas from 'html2canvas'
import moment from 'moment'

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
          `/api/reports/journal/${this.auth.user.BranchId}/${this.fromDate}/${this.toDate}`
        )
        this.items = response.data
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 1,
        filename: 'Journal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4, canvas: element },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    }
  },
  computed: {
    ...mapState(['auth']),
    formatFromDate () {
      return moment(this.fromDate).format('MMM DD YYYY')
    },
    formatToDate () {
      return moment(this.toDate).format('MMM DD YYYY')
    },
    formatItems () {
      const a = this.items.map(item => {
        item.date = moment(item.date).format('MMM DD YYYY')
        return item
      })
      return a
    }
  }
}
</script>

<style scoped>
  #content {
    color: black;
  }
</style>
