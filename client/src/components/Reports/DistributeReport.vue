<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card outlined class="my-6" min-height="400">
          <v-card-title>
            <v-col cols="12" md="12">
              <span class="title font-weight-light">Distribute Surplus</span>
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="selectYear"
                  :items="years"
                  item-text="date_part"
                  label="Select Year"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6" class="mt-3">
                <v-btn class="mx-1" small color="success" @click="generate">
                  Generate
                </v-btn>
                <v-btn class="mx-1" small color="primary" @click="dialog = true">
                  Edit Values
                </v-btn>
                <v-btn :hidden="hidden" class="mx-1" small dark color="amber darken-3" @click="confirmDialog = true">
                  Post
                </v-btn>
              </v-col>
            </v-row>
            <v-dialog
              v-model="confirmDialog"
              width="500"
            >
              <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                  <p class="subtitle-1">Convert undistributed net surplus with the generated allocation?</p>
                </v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn color="primary" text @click="confirmDialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="primary" text @click="post">
                    Proceed
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <v-card>
                <v-card-title>
                  <v-col cols="12" md="12">
                    <span class="title font-weight-light">Allocate Percentage</span>
                  </v-col>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="General Reserve Fund"
                        v-model="genReservePercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="CETF-National"
                        v-model="cetfNationalPercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="CETF-Local"
                        v-model="cetfLocalPercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="Optional Fund"
                        v-model="optionalPercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="Community Development Fund"
                        v-model="communityPercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        label="Interest on Capital & Patronage"
                        v-model="interestPercent"
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn color="primary" text @click="dialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <div class="text-center">
              <v-progress-circular
                v-if="loading === true"
                size="90"
                width="10"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <div :hidden="hidden" id="content" class="mx-6">
              <v-flex sm12 md10 offset-md1>
                <div class="text-center">
                  <p>
                    <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
                    <span v-else class="headline">{{ auth.user.Branch.branchName }}</span>
                  </p>
                  <p><span class="subtitle-2">As of December 31, {{selectYear.date_part}}</span></p>
                </div>
              </v-flex>
              <hr>
              <v-row>
                <v-col cols="12" md="9">
                  <p>Undistributed Net Surplus: {{currency(netProfit)}}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="9">
                  <p>Distribution of Net Surplus</p>
                </v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">General Reserve Fund</v-col>
                <v-col cols="12" md="2">{{genReservePercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(genReserve)}}</p></v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">CETF-National</v-col>
                <v-col cols="12" md="2">{{cetfNationalPercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(cetfNational)}}</p></v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">CETF-Local</v-col>
                <v-col cols="12" md="2">{{cetfLocalPercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(cetfLocal)}}</p></v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">Optional Fund</v-col>
                <v-col cols="12" md="2">{{optionalPercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(optionalFund)}}</p></v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">Community Development Fund</v-col>
                <v-col cols="12" md="2">{{communityPercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(communityFund)}}</p></v-col>
              </v-row>
              <v-row class="ml-10">
                <v-col cols="12" md="3">Interest on Capital & Patronage</v-col>
                <v-col cols="12" md="2">{{interestPercent}}%</v-col>
                <v-col cols="12" md="3"><p class="text-right total">{{currency(interest)}}</p></v-col>
              </v-row>
              <hr>
              <hr>
              <v-row class="ml-10">
                <v-col cols="12" md="3"></v-col>
                <v-col cols="12" md="2">
                  <p v-if="totalPercent != 100" class="red--text">{{totalPercent}}%</p>
                  <p v-else>{{totalPercent}}%</p>
                </v-col>
                <v-col cols="12" md="3">
                  <p class="text-right total">{{currency(totalDistributed)}}</p>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="text-center">
      <v-snackbar
        v-model="snackbar"
        bottom="bottom"
        color="success"
        :timeout="timeout"
      >
        Saved!
        <v-btn color="white" text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import numeral from 'numeral'

export default {
  name: 'DistributeReport',
  data () {
    return {
      snackbar: false,
      timeout: 2000,
      items: [],
      years: [],
      loading: false,
      selectYear: { date_part: 2019 },
      hidden: true,
      dialog: false,
      confirmDialog: false,
      genReservePercent: 50.00,
      cetfNationalPercent: 2.50,
      cetfLocalPercent: 2.50,
      optionalPercent: 2.50,
      communityPercent: 2.50,
      interestPercent: 40.00,
      check: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    currency (value) {
      return numeral(value).format('0,0.00')
    },
    sumAccountTypeBalance (typeId) {
      const types = this.accounts.filter(account => {
        return account.id === typeId
      })
      const typeBalance = types.map(type => {
        return parseFloat(type.balance)
      })
      const arrSum = balances => balances.reduce((a, b) => a + b, 0)
      const sum = arrSum(typeBalance)
      return parseFloat(sum).toFixed(2)
    },
    async generate () {
      try {
        this.loading = true
        const check = await axios.get(`/api/reports/check-distribute/${this.auth.user.BranchId}/${this.selectYear.date_part}`)
        const response = await axios.get(`/api/reports/distribute/${this.auth.user.BranchId}/${this.selectYear.date_part}`)
        this.check = check.data
        this.items = response.data
        this.loading = false
        this.hidden = false
      } catch (e) {
        this.getError(e.response.data)
      }
    },
    async post () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      try {
        const date = `${this.selectYear.date_part}-12-31`
        const newTransaction = JSON.stringify({
          BookkeeperId: this.auth.user.id,
          BookId: 1,
          memo: `${this.selectYear.date_part} distribution of net surplus (${this.auth.user.Branch.branchName})`,
          date: date,
          data: [
            {
              AccountId: 149,
              debit: null,
              credit: this.genReserve
            },
            {
              AccountId: 150,
              debit: null,
              credit: this.cetfNational
            },
            {
              AccountId: 151,
              debit: null,
              credit: this.cetfLocal
            },
            {
              AccountId: 153,
              debit: null,
              credit: this.optionalFund
            },
            {
              AccountId: 152,
              debit: null,
              credit: this.communityFund
            },
            {
              AccountId: 154,
              debit: null,
              credit: this.interest
            }
          ]
        })
        await axios.post('/api/bookkeeping/general-journal', newTransaction, config)
        this.confirmDialog = false
        this.snackbar = true
      } catch (e) {
        this.getError(e.response.data)
        this.confirmDialog = false
      }
    }
  },
  computed: {
    ...mapState(['auth']),
    accounts () {
      const items = this.items.map(item => {
        if (item.id === 11000 || item.id === 13000 || item.id === 50000 || item.id === 60000 || item.id === 70000) {
          item.balance = parseFloat(item.balance)
        } else {
          item.balance = parseFloat(item.balance) * (-1)
        }
        return item
      })
      return items
    },
    totalDirectCost () {
      const cost = parseFloat(this.sumAccountTypeBalance(50000)) + parseFloat(this.sumAccountTypeBalance(60000))
      return parseFloat(cost).toFixed(2)
    },
    grossProfit () {
      const grossProfit = parseFloat(this.sumAccountTypeBalance(40000)) - parseFloat(this.totalDirectCost)
      return parseFloat(grossProfit).toFixed(2)
    },
    netProfit () {
      const netProfit = parseFloat(this.grossProfit) - parseFloat(this.sumAccountTypeBalance(70000))
      return parseFloat(netProfit).toFixed(2)
    },
    genReserve () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.genReservePercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    cetfNational () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.cetfNationalPercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    cetfLocal () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.cetfLocalPercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    optionalFund () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.optionalPercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    communityFund () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.communityPercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    interest () {
      const amount = parseFloat(this.netProfit) * (parseFloat(this.interestPercent) / 100)
      return parseFloat(amount).toFixed(2)
    },
    totalDistributed () {
      const total = parseFloat(this.genReserve) + parseFloat(this.cetfNational) + parseFloat(this.cetfLocal) + parseFloat(this.optionalFund) + parseFloat(this.communityFund) + parseFloat(this.interest)
      return parseFloat(total).toFixed(2)
    },
    totalPercent () {
      const total = parseFloat(this.genReservePercent) + parseFloat(this.cetfNationalPercent) + parseFloat(this.cetfLocalPercent) + parseFloat(this.optionalPercent) + parseFloat(this.communityPercent) + parseFloat(this.interestPercent)
      return parseFloat(total).toFixed(2)
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
