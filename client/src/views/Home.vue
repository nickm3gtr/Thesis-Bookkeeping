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
      <v-row>
        <v-col cols="12" md="4">
          <p class="subtitle-2 font-weight-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis laoreet neque, eget ultrices massa gravida quis. In ut ornare lacus, a semper risus. Nulla nec augue dolor. Donec in tortor nec ipsum sollicitudin dapibus. Curabitur tellus arcu, efficitur nec dui porttitor, accumsan ullamcorper sem. Etiam ullamcorper neque id augue egestas, sed blandit enim sodales. Praesent in dolor bibendum, feugiat nisl ut, dapibus nisl. Aliquam sit amet massa ipsum.</p>
        </v-col>
        <v-col cols="12" md="4">
          <p class="subtitle-2 font-weight-light">Curabitur ultrices pellentesque eros. Vestibulum rhoncus arcu eget nunc facilisis efficitur. Quisque ultrices eros ac ante aliquam vehicula. Donec et interdum nisi, id efficitur ex. Praesent volutpat lectus sapien, vitae imperdiet turpis suscipit quis. Nulla a vehicula libero, quis iaculis mauris. Praesent at neque ut dolor pulvinar rutrum vel eget sem. Donec elementum bibendum nunc, a malesuada enim tempus vitae. Proin consequat magna a ante imperdiet, et mattis erat feugiat. Nunc pulvinar molestie aliquam. Aenean dolor sapien, fringilla at gravida in, porta ac nibh. Morbi ut placerat mi, non vehicula nunc. Nam sagittis justo id urna faucibus lacinia. Mauris lacinia libero sed tortor congue egestas. Cras quis lectus odio. Etiam ut ipsum sit amet risus imperdiet cursus.</p>
        </v-col>
        <v-col cols="12" md="4">
          <p class="subtitle-2 font-weight-light">Curabitur ultrices pellentesque eros. Vestibulum rhoncus arcu eget nunc facilisis efficitur. Quisque ultrices eros ac ante aliquam vehicula. Donec et interdum nisi, id efficitur ex. Praesent volutpat lectus sapien, vitae imperdiet turpis suscipit quis. Nulla a vehicula libero, quis iaculis mauris. Praesent at neque ut dolor pulvinar rutrum vel eget sem. Donec elementum bibendum nunc, a malesuada enim tempus vitae. Proin consequat magna a ante imperdiet, et mattis erat feugiat. Nunc pulvinar molestie aliquam. Aenean dolor sapien, fringilla at gravida in, porta ac nibh. Morbi ut placerat mi, non vehicula nunc. Nam sagittis justo id urna faucibus lacinia. Mauris lacinia libero sed tortor congue egestas. Cras quis lectus odio. Etiam ut ipsum sit amet risus imperdiet cursus.</p>
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
  name: 'Home',
  data () {
    return {
      overlay: false,
      items: [
        {
          src: require('@/assets/slide1.jpg')
        },
        {
          src: require('@/assets/slide2.jpg')
        },
        {
          src: require('@/assets/slide3.jpg')
        },
        {
          src: require('@/assets/slide4.jpg')
        }
      ],
      links: [
        'Home',
        'About Us',
        'Team',
        'Services',
        'Blog',
        'Contact Us'
      ]
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>

<style scoped>
.home {
  background-color: white;
}
</style>
