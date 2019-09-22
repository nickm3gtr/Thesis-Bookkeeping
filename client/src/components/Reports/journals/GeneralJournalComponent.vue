<template>
  <div class="general-journal">
    <div class="text-center">
      <p>
        <span v-if="auth.user === null" class="headline">DARBMUPCO</span>
        <span v-else class="headline centered">{{ auth.user.Branch.branchName }}</span>
      </p>
      <p><span class="subtitle-1">General Journal</span></p>
      <p><span class="subtitle-2">{{ formatFromDate }} through {{ formatToDate }}</span></p>
      <hr>
    </div>
    <v-row class="ml-4">
      <v-col cols="12" md="2">
        <p class="font-weight-medium">Date</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="font-weight-medium">Memo</p>
      </v-col>
      <v-col cols="12" md="3">
        <p class="font-weight-medium">Account</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium text-center">Debit</p>
      </v-col>
      <v-col cols="12" md="2">
        <p class="font-weight-medium text-center">Credit</p>
      </v-col>
    </v-row>
    <hr>
    <div v-for="item in formatItems" :key="item.id">
      <v-row>
        <v-col cols="12" md="2">
          <span v-if="item.debit === null"></span>
          <span class="body-2 font-weight-medium" v-else>{{ item.date }}</span>
        </v-col>
        <v-col cols="12" md="3">
          <span v-if="item.debit === null"></span>
          <span class="body-2 font-weight-medium" v-else>{{ item.memo }}</span>
        </v-col>
        <v-col cols="12" md="3">
          <span class="body-2 font-weight-medium">{{ item.accountname }}</span>
        </v-col>
        <v-col cols="12" md="2">
          <p class="body-2 font-weight-medium text-right">{{ item.debit }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="body-2 font-weight-medium text-right">{{ item.credit }}</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GeneralJournalComponent',
  props: [ 'formatFromDate', 'formatToDate', 'formatItems' ],
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped>

</style>
