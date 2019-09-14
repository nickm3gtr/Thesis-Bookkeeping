<template>
  <div class="ledger-report">
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
              <v-col cols="10" md="4">
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
                <v-btn dark color="primary" class="mx-2" @click="generate"
                  >Generate</v-btn
                >
                <v-btn dark color="success" class="mx-2" @click="pdf"
                  >Download PDF</v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <div id="content">
            <v-card-text>
              <div class="text-center">
                <p>
                  <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                  <span v-else class="headline">{{ auth.user.Branch.branchName }}</span>
                </p>
                <p><span class="subtitle-1">General Ledger</span></p>
                <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
              </div>
              <hr>
              <v-row class="ml-12">
                <v-col cols="12" md="4">
                  <span class="font-weight-medium">Name</span>
                </v-col>
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Debit</span>
                </v-col>
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Credit</span>
                </v-col>
                <v-col cols="12" md="2">
                  <span class="font-weight-medium">Balance</span>
                </v-col>
              </v-row>
              <hr>
              <br>
              <CurrentAssets :currentAssets="currentAssets" />
              <NonCurrentAssets :nonCurrentAssets="nonCurrentAssets" />
              <CurrentLiabilities :currentLiabilities="currentLiabilities" />
              <NonCurrentLiabilities :nonCurrentLiabilities="nonCurrentLiabilities" />
              <Equity :equity="equity" />
              <Revenue :revenue="revenue" />
              <CostOfGoodsSold :costOfGoods="costOfGoods" />
              <CostOfServices :costOfServices="costOfServices" />
              <Expenses :expenses="expenses" />
              <Subsidy :subsidy="subsidy" />
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import moment from 'moment'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import CurrentAssets from '@/components/Reports/ledgers/CurrentAssets'
import NonCurrentAssets from '@/components/Reports/ledgers/NonCurrentAssets'
import CurrentLiabilities from '@/components/Reports/ledgers/CurrentLiabilities'
import NonCurrentLiabilities from '@/components/Reports/ledgers/NonCurrentLiabilities'
import Equity from '@/components/Reports/ledgers/Equity'
import Revenue from '@/components/Reports/ledgers/Revenue'
import CostOfGoodsSold from '@/components/Reports/ledgers/CostOfGoodsSold'
import CostOfServices from '@/components/Reports/ledgers/CostOfServices'
import Expenses from '@/components/Reports/ledgers/Expenses'
import Subsidy from '@/components/Reports/ledgers/Subsidy'

export default {
  name: 'LedgerReport',
  components: {
    CurrentAssets,
    NonCurrentAssets,
    CurrentLiabilities,
    NonCurrentLiabilities,
    Equity,
    Revenue,
    CostOfGoodsSold,
    CostOfServices,
    Expenses,
    Subsidy
  },
  data () {
    return {
      fromMenu: false,
      toMenu: false,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      items: []
    }
  },
  methods: {
    async generate () {
      try {
        const response = await axios.get(
          `/api/reports/ledger/${this.auth.user.BranchId}/${this.fromDate}/${this.toDate}`
        )
        this.items = response.data
        console.log(this.items)
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    pdf () {
      // eslint-disable-next-line new-cap
      const filename = 'Ledger.pdf'

      html2canvas(document.querySelector('#content'), { scale: 2, pagesplit: true, retina: true }).then(canvas => {
        // eslint-disable-next-line new-cap
        let pdf = new jsPDF('p', 'mm', 'a4')
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 10, 180, 250)
        pdf.save(filename)
      })
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
    },
    currentAssets () {
      return this.items.filter(item => {
        return item.id === 11000
      })
    },
    nonCurrentAssets () {
      return this.items.filter(item => {
        return item.id === 13000
      })
    },
    currentLiabilities () {
      return this.items.filter(item => {
        return item.id === 21000
      })
    },
    nonCurrentLiabilities () {
      return this.items.filter(item => {
        return item.id === 22000
      })
    },
    equity () {
      return this.items.filter(item => {
        return item.id === 30100
      })
    },
    revenue () {
      return this.items.filter(item => {
        return item.id === 40000
      })
    },
    costOfGoods () {
      return this.items.filter(item => {
        return item.id === 50000
      })
    },
    costOfServices () {
      return this.items.filter(item => {
        return item.id === 60000
      })
    },
    expenses () {
      return this.items.filter(item => {
        return item.id === 70000
      })
    },
    subsidy () {
      return this.items.filter(item => {
        return item.id === 80000
      })
    }
  }
}
</script>

<style scoped></style>
