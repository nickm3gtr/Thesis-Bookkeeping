<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined elevation="10" class="mb-10" min-height="400">
          <v-toolbar color="light-blue darken-3" dark>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="firstYear"
                  :items="years"
                  item-text="date_part"
                  label="Select Year"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="secondYear"
                  :items="years"
                  item-text="date_part"
                  label="Select Year"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="selectType"
                  :items="type"
                  item-text="date_part"
                  label="Select Report Type"
                  return-object
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-container class="mt-0" fluid>
                  <v-radio-group v-model="radio" row v-if="selectType === 'Summary'">
                    <v-radio label="Balance Sheet" value="Balance Sheet"></v-radio>
                    <v-radio label="Income Statement" value="Income Statement"></v-radio>
                  </v-radio-group>
                </v-container>
              </v-col>
              <v-col cols="12" md="6" class="mt-3">
                <v-btn dark color="primary" class="mx-2" @click="generate"
                >Generate</v-btn
                >
                <v-btn dark color="success" class="mx-2" @click="pdf"
                >Download PDF</v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <div class="text-center">
            <v-progress-circular
              v-if="loading === true"
              size="90"
              width="10"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <v-card-text>
            <div :hidden="hidden" id="content" v-if="loading === false">
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span
                      v-if="auth.user === null || auth.user.account == 'admin'"
                      class="headline"
                    >DARBMUPCO-Common</span>
                    <span v-else class="headline centered">DARBMUPCO-Common</span>
                  </p>
                  <p><span class="subtitle-1">Statement of Financial Condition</span></p>
                  <p><span class="subtitle-2">As of December 31, {{firstYear.date_part}} and {{secondYear.date_part}}</span></p>
                </div>
              </v-flex>
              <hr>
              <div class="mx-12" v-if="selectType === 'Note'">
                <v-row class="ml-10">
                <v-col cols="12" md="5"></v-col>
                <v-col cols="12" md="3"><p class="text-right">{{bigYear}}</p></v-col>
                <v-col cols="12" md="3"><p class="text-right">{{smallYear}}</p></v-col>
              </v-row>
              </div>
              <div v-if="selectType === 'Note'">
                <AssetsNotes
                  :accounts="formatItems"
              />
              </div>
              <div v-else>
                <div v-if="radio === 'Balance Sheet'">
                  <BalanceSummary
                    :accounts="formatItems"
                    :profits="formatProfits"
                    :bigYear="bigYear"
                    :smallYear="smallYear"
                  />
                </div>
                <div v-else-if="radio === 'Income Statement'">
                  <IncomeSummary
                    :accounts="formatItems"
                    :bigYear="bigYear"
                    :smallYear="smallYear"
                  />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import html2pdf from 'html2pdf.js'
import AssetsNotes from './notes/AssetsNotes'
import BalanceSummary from './notes/BalanceSummary'
import IncomeSummary from './notes/IncomeSummary'

export default {
  name: 'AdminNotesReport',
  components: {
    AssetsNotes,
    BalanceSummary,
    IncomeSummary
  },
  data () {
    return {
      loading: false,
      hidden: true,
      years: [],
      firstYear: { date_part: 2019 },
      secondYear: { date_part: 2019 },
      items: [],
      profits: [],
      type: ['Summary', 'Note'],
      selectType: 'Summary',
      radio: 'Balance Sheet'
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    async generate () {
      try {
        this.loading = true
        const response = await axios.get(`/api/reports/notes/1/${this.firstYear.date_part}/${this.secondYear.date_part}`)
        const profit = await axios.get(`/api/reports/summary/net-profit/1/${this.firstYear.date_part}/${this.secondYear.date_part}`)
        this.items = response.data
        this.profits = profit.data
        this.loading = false
      } catch (e) {
        this.getError(e.response.data)
        this.loading = false
      }
      this.hidden = false
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 0.5,
        filename: 'BalanceSheet.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    },
    filterItems (typeId) {
      const revenues = this.items.filter(item => {
        return item.id === typeId
      })
      return revenues
    }
  },
  computed: {
    ...mapState(['auth']),
    formatItems () {
      const items = this.items.map(item => {
        if (item.id === 11000 || item.id === 13000 || item.id === 50000 || item.id === 60000 || item.id === 70000) {
          item.balance1 = parseFloat(item.balance1)
          item.balance2 = parseFloat(item.balance2)
        } else {
          item.balance1 = parseFloat(item.balance1) * (-1)
          item.balance2 = parseFloat(item.balance2) * (-1)
        }
        return item
      })
      return items
    },
    formatProfits () {
      const items = this.profits.map(item => {
        if (item.id === 11000 || item.id === 13000 || item.id === 50000 || item.id === 60000 || item.id === 70000) {
          item.balance1 = parseFloat(item.balance1)
          item.balance2 = parseFloat(item.balance2)
        } else {
          item.balance1 = parseFloat(item.balance1) * (-1)
          item.balance2 = parseFloat(item.balance2) * (-1)
        }
        return item
      })
      return items
    },
    bigYear () {
      if (this.firstYear.date_part > this.secondYear.date_part) {
        return this.firstYear.date_part
      } else {
        return this.secondYear.date_part
      }
    },
    smallYear () {
      if (this.firstYear.date_part < this.secondYear.date_part) {
        return this.firstYear.date_part
      } else {
        return this.secondYear.date_part
      }
    }
  },
  async mounted () {
    try {
      const response = await axios.get('/api/transactions/admin-years')
      this.years = response.data
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>

<style scoped>
#content {
  color: black;
}
</style>
