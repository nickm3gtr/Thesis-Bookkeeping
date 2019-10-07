<template>
  <div>
    <v-card v-if="loading===true" color="primary" dark>
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-title>
        <span class="title">Add Transaction</span>
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-combobox
                  v-model="selected"
                  :items="accounts"
                  item-text="name"
                  label="Select Account Name"
                  return-object
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="amount" label="Amount"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" @click="$emit('close-dialog')" text>Close</v-btn>
          <v-btn color="blue darken-1" text @click="add" :disabled="isIncomplete">Add</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PurchaseBookDialog',
  data () {
    return {
      loading: false,
      selected: '',
      amount: '',
      accounts: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      const transaction = {
        AccountId: this.selected.id,
        debit: this.amount,
        credit: null
      }
      this.$emit('add-transaction', transaction)
      this.$emit('close-dialog')
      this.selected = ''
      this.amount = ''
    }
  },
  async mounted () {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      this.loading = true
      const response = await axios.get('/api/accounts', config)
      this.accounts = response.data
      this.loading = false
    } catch (e) {
      this.getError(e.response.data)
      this.loading = false
    }
  },
  computed: {
    ...mapState(['auth']),
    isIncomplete () {
      return this.selected === '' || (this.amount === '')
    }
  }
}
</script>

<style scoped>

</style>
