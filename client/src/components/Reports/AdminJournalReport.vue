<template>
  <div id="journal" class="journal-report">
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined elevation="10" class="mb-10" min-height="400">
          <v-toolbar color="light-blue darken-3" dark>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="2">
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
              <v-col cols="12" md="2">
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
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="selected"
                  :items="books"
                  item-text="name"
                  label="Select Book"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="selectedBranch"
                  :items="branches"
                  item-text="branchName"
                  label="Select Branch"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="5" class="mt-3">
                <v-btn dark color="primary" class="mx-2" @click="generate">Generate</v-btn>
                <v-btn dark color="success" class="mx-2" @click="pdf">Download PDF</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <div id="content" class="mx-12" :hidden="hidden">
            <v-card-text>
              <div v-if="selected === null || selected === '' || selected.id === 1">
                <GeneralJournalComponent
                  :formatFromDate="formatFromDate"
                  :formatToDate="formatToDate"
                  :formatItems="formatItems"
                  :selectedBranch="selectedBranch"
                />
              </div>
              <div v-else-if="selected.id === 2">
                <CashReceiptComponent
                  :formatFromDate="formatFromDate"
                  :formatToDate="formatToDate"
                  :formatItems="formatItems"
                />
              </div>
              <div v-else-if="selected.id === 3">
                <CashDisbursementComponent
                  :formatFromDate="formatFromDate"
                  :formatToDate="formatToDate"
                  :formatItems="formatItems"
                />
              </div>
              <div v-else-if="selected.id === 4">
                <PurchaseComponent
                  :formatFromDate="formatFromDate"
                  :formatToDate="formatToDate"
                  :formatItems="formatItems"
                />
              </div>
              <div v-else-if="selected.id === 5">
                <SalesComponent
                  :formatFromDate="formatFromDate"
                  :formatToDate="formatToDate"
                  :formatItems="formatItems"
                />
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
import moment from 'moment'
import GeneralJournalComponent from '@/components/Reports/journals/GeneralJournalComponent'
import CashReceiptComponent from '@/components/Reports/journals/CashReceiptComponent'
import CashDisbursementComponent from '@/components/Reports/journals/CashDisbursementComponent'
import PurchaseComponent from '@/components/Reports/journals/PurchaseComponent'
import SalesComponent from '@/components/Reports/journals/SalesComponent'

export default {
  name: 'AdminJournalReport',
  components: {
    GeneralJournalComponent,
    CashReceiptComponent,
    CashDisbursementComponent,
    PurchaseComponent,
    SalesComponent
  },
  data () {
    return {
      selected: { id: 1, name: 'General Journal' },
      selectedBranch: { id: 0, branchName: 'DARBMUPCO' },
      books: [],
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
      items: [],
      hidden: true,
      branches: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async generate () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const response = await axios.get(
          `/api/reports/journal/${this.selectedBranch.id}/${this.selected.id}/${this.fromDate}/${this.toDate}`, config
        )
        this.items = response.data
      } catch (e) {
        if (e.response.data) this.getError(e.response.data)
        this.getError("Can't fetch journal")
      }
      this.hidden = false
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 0.5,
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
      return moment(this.fromDate).format('MMMM DD')
    },
    formatToDate () {
      return moment(this.toDate).format('MMMM DD YYYY')
    },
    formatItems () {
      const a = this.items.map(item => {
        item.date = moment(item.date).format('MMM DD')
        return item
      })
      return a
    }
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      const response = await axios.get('/api/books', config)
      const branches = await axios.get('/api/admin/branches', config)
      this.books = response.data
      this.branches = [{ id: 0, branchName: 'DARBMUPCO' }, ...branches.data]
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  watch: {
    selected () {
      if (this.selected !== null || this.selected !== '') {
        this.generate()
      }
    }
  }
}
</script>

<style scoped>
  #content {
    color: black;
    font-family: "Roboto", sans-serif;
  }
  .text-center {
    text-align: center;
  }
</style>
