<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="title">Change Amount</span>
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="transaction.debit" label="Debit"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="transaction.credit" label="Credit"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="updateTransaction">Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TransactionFilterDialog',
  props: [ 'transaction' ],
  methods: {
    ...mapActions('errors', ['getError']),
    closeDialog () {
      this.$emit('close-dialog')
      this.selected = ''
    },
    updateTransaction () {
      this.closeDialog()
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>
