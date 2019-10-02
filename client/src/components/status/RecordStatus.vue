<template>
  <v-card class="mt-4" :hidden="hidden">
    <v-card-title>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="blue darken-2"
      ></v-progress-linear>
      <span class="blue--text text--darken-3 title font-weight-medium">
        Saved!
      </span>
      <v-spacer></v-spacer>
      <v-btn text fab color="red" x-small @click="$emit('close-status')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        dense
        :headers="headers"
        :items="items"
        hide-default-footer
        disable-sort
        item-key="id"
      >
        <template v-slot:body="{ items }">
          <tbody>
          <tr v-for="item in items" :key="item.name">
            <td>{{ item.name }}</td>
            <td>
              <span v-if="item.debit == 0"></span>
              <span v-else>{{ item.debit }}</span>
            </td>
            <td>
              <span v-if="item.credit == 0"></span>
              <span v-else>{{ item.credit }}</span>
            </td>
          </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'RecordStatus',
  props: ['hidden', 'statusId'],
  data () {
    return {
      loading: false,
      items: [],
      headers: [
        {
          text: 'AccountName',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Debit',
          align: 'left',
          sortable: false,
          value: 'debit'
        },
        {
          text: 'Credit',
          align: 'left',
          sortable: false,
          value: 'credit'
        }
      ]
    }
  },
  methods: {
    ...mapActions('errors', ['getError'])
  },
  computed: {
    ...mapState(['auth'])
  },
  watch: {
    async statusId () {
      try {
        this.loading = true
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
        const response = await axios.get(`/api/bookkeeping/transactions/latest/${this.auth.user.id}`)
        const transId = response.data.TransId
        const transaction = await axios.get(`/api/bookkeeping/transactions/trans_id/${transId}`, config)
        this.items = transaction.data
        this.loading = false
      } catch (e) {
        this.getError(e.response.data)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
