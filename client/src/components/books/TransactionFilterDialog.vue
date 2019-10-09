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
          <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
          <v-btn color="blue darken-1" text @click="updateTransaction">Update</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'TransactionFilterDialog',
  props: [ 'transaction' ],
  data () {
    return {
      loading: false,
      selected: '',
      accounts: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    closeDialog () {
      this.$emit('close-dialog')
      this.selected = ''
    },
    updateTransaction () {
      this.transaction.account_id = this.selected.id
      this.transaction.name = this.selected.name
      this.closeDialog()
    }
  },
  computed: {
    ...mapState(['auth'])
  },
  async mounted () {
    this.selected = {
      id: this.transaction.account_id,
      name: this.transaction.name
    }
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
  watch: {
    transaction () {
      this.selected = {
        id: this.transaction.account_id,
        name: this.transaction.name
      }
    }
  }
}
</script>
