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
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="1">
                <v-dialog persistent v-model="dialog" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark fab small class="mb-2 mt-4" v-on="on">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <GeneralJournalDialog
                    @close-dialog="dialog = false"
                    @add-transaction="add"
                  />
                </v-dialog>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="red" dark fab small class="mb-2 mt-4" @click="clear">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="success" dark fab small class="mb-2 mt-4">
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

export default {
  name: 'GeneralJournal',
  components: { GeneralJournalDialog },
  data () {
    return {
      dialog: false,
      headers: [
        { text: 'AccountName', value: 'AccountName' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ],
      items: []
    }
  },
  methods: {
    add (transaction) {
      this.items = [ ...this.items, transaction ]
    },
    clear () {
      this.items = []
    }
  }
}
</script>

<style scoped>

</style>
