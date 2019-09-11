<template>
  <div>
    <v-card v-if="loading===true"
      color="primary"
      dark
    >
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
                <v-text-field v-model="debit" :disabled="creditNotNull" label="Debit"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="credit" :disabled="debitNotNull" label="Credit"></v-text-field>
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
  name: 'GeneralJournalDialog',
  props: [ 'transId', 'memo' ],
  data () {
    return {
      loading: false,
      selected: '',
      debit: '',
      credit: '',
      accounts: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      const transaction = {
        BookkeeperId: this.auth.user.id,
        TransId: this.transId,
        AccountId: this.selected.id,
        memo: this.memo,
        AccountName: this.selected.name,
        debit: this.debit,
        credit: this.credit
      }
      this.$emit('add-transaction', transaction)
      this.$emit('close-dialog')
      this.selected = ''
      this.debit = ''
      this.credit = ''
    }
  },
  async mounted () {
    try {
      this.loading = true
      const response = await axios.get('/api/accounts')
      this.accounts = response.data
      this.loading = false
    } catch (e) {
      this.getError(e.response.data)
      this.loading = false
    }
  },
  computed: {
    ...mapState(['auth']),
    creditNotNull () {
      return this.credit.length > 0
    },
    debitNotNull () {
      return this.debit.length > 0
    },
    isIncomplete () {
      return this.selected === '' || (this.debit === '' && this.credit === '')
    }
  }
}
</script>

<style scoped></style>
