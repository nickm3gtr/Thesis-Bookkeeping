<template>
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
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
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
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SalesBookDialog',
  data () {
    return {
      loading: false,
      selected: '',
      amount: '',
      AccountId: 40310,
      AccountName: '40310-Sales'
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      const transaction = {
        AccountId: this.AccountId,
        debit: null,
        credit: this.amount
      }
      this.$emit('add-transaction', transaction)
      this.$emit('close-dialog')
      this.selected = ''
      this.amount = ''
    }
  },
  computed: {
    ...mapState(['auth']),
    isIncomplete () {
      return this.amount === ''
    }
  }
}
</script>

<style scoped>

</style>
