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
      <span class="title">Enter Accounts Receivable Account</span>
    </v-card-title>
    <v-form>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="selected"
                :items="filterAccounts"
                item-text="name"
                label="Select Account Name"
                return-object
              ></v-combobox>
            </v-col>
            <v-col :hidden="hideSubAccount" cols="12" md="6">
              <v-combobox
                v-model="sub"
                :items="subAccount"
                item-text="name"
                label="Select Sub-Account"
                return-object
              ></v-combobox>
            </v-col>
            <div v-if="sub !== ''">
              <div v-if="sub.sub">
                <v-col :hidden="hideSubAccount" cols="12" md="6">
                <v-combobox
                  v-model="subSecond"
                  :items="sub.sub"
                  item-text="name"
                  label="Select Sub-Account"
                  return-object
                ></v-combobox>
              </v-col>
              </div>
            </div>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field v-model="$v.amount.$model" label="Amount"></v-text-field>
              <p class="error--text" v-if="!$v.amount.decimal">
                Please input a number
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="blue darken-1" @click="$emit('close-dialog')" text>Close</v-btn>
        <v-btn color="blue darken-1" text @click="add" :disabled="isIncomplete || $v.$invalid">Add</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { decimal } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  name: 'SalesBookDialog',
  data () {
    return {
      loading: false,
      selected: '',
      amount: '',
      accounts: [],
      sub: '',
      subSecond: ''
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      let sub = null
      if (this.sub !== '') {
        if (this.subSecond !== '') {
          sub = { name: { name: this.sub.name, sub: this.subSecond.name } }
        } else {
          sub = { name: this.sub }
        }
      }
      const transaction = {
        AccountId: this.selected.id,
        AccountName: this.selected.name,
        debit: this.amount,
        credit: null,
        sub: sub
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
    },
    subAccount () {
      if (!this.selected.sub) {
        return []
      } else {
        return this.selected.sub.subaccounts
      }
    },
    hideSubAccount () {
      if (this.selected === '') {
        return true
      } else if (!this.selected.sub) {
        return true
      } else {
        return false
      }
    },
    filterAccounts () {
      return this.accounts.filter(account => {
        return account.id === 15 || account.id === 16 || account.id === 17 || account.id === 27
      })
    }
  },
  watch: {
    selected () {
      this.sub = ''
    }
  },
  validations: {
    amount: {
      decimal
    }
  }
}
</script>

<style scoped>

</style>
