<template>
  <div>
    <v-layout>
      <v-flex sm12 md10 offset-md1>
        <v-card>
          <v-card-text>
            <v-data-table
              hide-default-footer
              disable-sort
              item-key="id"
              :headers="headers"
              :items="formatTransactions"
              :items-per-page="5"
              :search="search"
              :loading="loading"
              loading-text="Loading..."
              class="elevation-3"
            >
              <template v-slot:body="{ items }">
                <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>
                    <span v-if="item.debit === null"></span>
                    <span v-else>{{ item.date }}</span>
                  </td>
                  <td>
                    <span v-if="item.debit === null"></span>
                    <span v-else>{{ item.num }}</span>
                  </td>
                  <td>
                    <span v-if="item.debit === null"></span>
                    <span v-else>{{ item.memo }}</span>
                  </td>
                  <td>
                    <span></span>
                    <span>{{ item.name }}</span>
                  </td>
                  <td>
                    <span></span>
                    <span>{{ item.debit }}</span>
                  </td>
                  <td>
                    <span></span>
                    <span>{{ item.credit }}</span>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'TransactionFilter',
  data () {
    return {
      search: '',
      transactions: [],
      loading: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Num', value: 'num' },
        { text: 'Memo', value: 'memo' },
        { text: 'Account', value: 'name' },
        { text: 'Debit', value: 'debit' },
        { text: 'Credit', value: 'credit' }
      ]
    }
  },
  computed: {
    formatTransactions () {
      return this.transactions.map(transaction => {
        transaction.date = moment(transaction.date).format('MMM DD')
        return transaction
      })
    }
  },
  async mounted () {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }
    try {
      this.loading = true
      const transactions = await axios.get(
        `/api/bookkeeping/transactions/trans_id/${this.$route.params.transId}`,
        config
      )
      this.loading = false
      this.transactions = transactions.data
    } catch (e) {
      this.getError(e.response.data)
    }
  }
}
</script>

<style scoped></style>
