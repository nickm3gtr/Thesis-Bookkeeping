<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="9">
                <v-textarea
                  outlined
                  rows="1"
                  row-height="15"
                  name="input-7-4"
                  label="Description..."
                  value=""
                  :model="memo"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="1">
                <v-dialog persistent v-model="dialog" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark fab small class="mt-4" v-on="on">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <GeneralJournalDialog
                    :transId="transId"
                    :memo="memo"
                    @close-dialog="dialog = false"
                    @add-transaction="add"
                  />
                </v-dialog>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="red" dark fab small class="mt-4" @click="clear">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="success" dark fab small class="mt-4" @click="save">
                  <v-icon>save</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              hide-default-footer
              disable-sort
              :headers="headers"
              :items="items"
              no-data-text="Add General Journal transactions"
              class="elevation-3"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import GeneralJournalDialog from './GeneralJournalDialog'
import { mapActions } from 'vuex'
import uuid from 'uuid/v4'
import axios from 'axios'

export default {
  name: 'GeneralJournal',
  components: { GeneralJournalDialog },
  data () {
    return {
      transId: uuid(),
      dialog: false,
      memo: '',
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ],
      items: []
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    add (transaction) {
      this.items = [ ...this.items, transaction ]
    },
    clear () {
      this.items = []
    },
    async save () {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const newTransaction = JSON.stringify({ data: this.items })
        console.log(newTransaction)
        const response = await axios.post('/api/general-journal', newTransaction, config)
        const savedTransaction = response.data
        if (!savedTransaction) console.log('Failed')
      } catch (e) {
        this.getError(e.response.data)
        console.log(e.response.data)
      }
    }
  }
}
</script>

<style scoped>

</style>
