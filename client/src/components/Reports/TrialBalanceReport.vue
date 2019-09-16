<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Choose Date"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    v-model="date"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="10" md="2">
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
          <div id="content">
            <v-card-text>
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                    <span v-else class="headline">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-1">Trial Balance</span></p>
                  <p><span class="subtitle-2">As of {{ formatDate }}</span></p>
                </div>
                <hr>
                <div class="text-center"></div>
                <v-row class="ml-4">
                  <v-col cols="12" md="4">
                    <span class="font-weight-medium">Category</span>
                  </v-col>
                  <v-col cols="12" md="4">
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
                <div v-for="item in filterNullItems" :key="item.id">
                  <v-row>
                    <v-col cols="12" md="4">
                      <span class="font-weight-medium">{{ item.subtype }}</span>
                    </v-col>
                    <v-col cols="12" md="4">
                      <span class="font-weight-medium">{{ item.account }}</span>
                    </v-col>
                    <v-col cols="12" md="2">
                      <p v-if="item.balance>0" class="text-right"><span class="font-weight-medium">{{ formatBalance(item.balance) }}</span></p>
                      <p v-else><span></span></p>
                    </v-col>
                    <v-col cols="12" md="2">
                      <p v-if="item.balance<0" class="text-right"><span class="font-weight-medium">{{ formatBalance(item.balance) }}</span></p>
                      <p v-else><span></span></p>
                    </v-col>
                  </v-row>
                </div>
              </v-flex>
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import axios from 'axios'

export default {
  name: 'TrialBalanceReport',
  data () {
    return {
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      items: []
    }
  },
  methods: {
    formatBalance (value) {
      const num = Math.abs(value)
      return parseFloat(Math.round(num * 100) / 100).toFixed(2)
    },
    pdf () {
      const element = document.getElementById('content')
      const opt = {
        margin: 1,
        filename: 'TrialBalance.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().from(element).set(opt).save()
    },
    async generate () {
      try {
        const response = await axios.get(
          `/api/reports/trial-balance/${this.auth.user.BranchId}/${this.date}`
        )
        this.items = response.data
      } catch (e) {
        this.getError(e.response.data)
      }
    }
  },
  computed: {
    ...mapState(['auth']),
    formatDate () {
      return moment(this.date).format('MMM DD YYYY')
    },
    filterNullItems () {
      return this.items.filter(item => {
        return item.balance !== null
      })
    }
  }
}
</script>

<style scoped>

</style>
