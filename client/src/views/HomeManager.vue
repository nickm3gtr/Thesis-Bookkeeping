<template>
  <div class="home">
    <div class="text-center">
      <v-overlay
        v-if="auth !== null && auth.isLoading"
        :value="!overlay"
      >
      </v-overlay>
      <v-progress-linear
        v-if="auth !== null && auth.isLoading"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </div>
    <div>
      <v-carousel>
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item.src"
        >
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="mx-10">
      <v-row class="mt-15">
        <v-col cols="12" md="4">
          <div class="text-center mt-10"><v-icon color="blue lighten-1" x-large>monetization_on</v-icon></div>
          <p class="subtitle-1 my-12 text-justify mx-10 font-weight-light">A bookkeeping system for DARBMUPCO that tracks all information on its books to make key operating, investing and financing decisions. Provides a secure platform to store all the financial data of the company.</p>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-center mt-10"><v-icon color="blue lighten-1" x-large>menu_book</v-icon></div>
          <p class="subtitle-1 my-12 text-justify mx-10 font-weight-light">Specialized recording using different books to easily categorize the different transactions of DARBMUPCO. Provides an easy to use interface to record transactions into Cash Receipt Book, Cash Disbursement Book, Sales Book, Purchase Book and General Journal.</p>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-center mt-10"><v-icon color="blue lighten-1" x-large>poll</v-icon></div>
          <p class="subtitle-1 my-12 text-justify mx-10 font-weight-light">Automatic generation of financial statements from the recorded transactions. Reports like Journal, Ledger, Trial Balance, Income Statement, Balance Sheet and Year-end Reports are present in the system.</p>
        </v-col>
      </v-row>
    </div>
    <v-footer
    color="blue-grey darken-1"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-col
        class="blue-grey lighten-2 py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>DARBMUPCO</strong>
      </v-col>
    </v-row>
  </v-footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeManager',
  data () {
    return {
      overlay: false,
      items: [
        {
          src: require('@/assets/Slide-1.jpg')
        },
        {
          src: require('@/assets/Slide-2.jpg')
        },
        {
          src: require('@/assets/Slide-3.jpg')
        }
      ],
      links: [
        'Home',
        'About Us',
        'Contact Us'
      ]
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped></style>
