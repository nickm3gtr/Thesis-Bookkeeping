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
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="selected"
                  :items="accounts"
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
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="$v.debit.$model" :disabled="creditNotNull" label="Debit"></v-text-field>
                <p class="error--text" v-if="!$v.debit.decimal">
                  Please input a number
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="$v.credit.$model" :disabled="debitNotNull" label="Credit"></v-text-field>
                <p class="error--text" v-if="!$v.credit.decimal">
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import { decimal } from 'vuelidate/lib/validators'

export default {
  name: 'GeneralJournalDialog',
  data () {
    return {
      loading: false,
      selected: '',
      debit: '',
      credit: '',
      accounts: [],
      sub: ''
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add () {
      let sub = null
      if (this.sub !== '') {
        sub = { name: this.sub }
      }
      const transaction = {
        AccountId: this.selected.id,
        AccountName: this.selected.name,
        debit: this.debit,
        credit: this.credit,
        sub: sub
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
    creditNotNull () {
      return this.credit.length > 0
    },
    debitNotNull () {
      return this.debit.length > 0
    },
    isIncomplete () {
      return this.selected === '' || (this.debit === '' && this.credit === '')
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
    }
  },
  watch: {
    selected () {
      this.sub = ''
    }
  },
  validations: {
    debit: {
      decimal
    },
    credit: {
      decimal
    }
  }
}
</script>

<style scoped></style>
