<template>
  <div>
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
          <v-row
          class="fill-height"
          align="center"
          justify="center"
          >
            <div class="display-3">Slide</div>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="mx-10">
      <v-row>
        <v-col cols="12" md="4">
          <p class="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis laoreet neque, eget ultrices massa gravida quis. In ut ornare lacus, a semper risus. Nulla nec augue dolor. Donec in tortor nec ipsum sollicitudin dapibus. Curabitur tellus arcu, efficitur nec dui porttitor, accumsan ullamcorper sem. Etiam ullamcorper neque id augue egestas, sed blandit enim sodales. Praesent in dolor bibendum, feugiat nisl ut, dapibus nisl. Aliquam sit amet massa ipsum.</p>
        </v-col>
        <v-col cols="12" md="4">
          <p class="caption">Curabitur ultrices pellentesque eros. Vestibulum rhoncus arcu eget nunc facilisis efficitur. Quisque ultrices eros ac ante aliquam vehicula. Donec et interdum nisi, id efficitur ex. Praesent volutpat lectus sapien, vitae imperdiet turpis suscipit quis. Nulla a vehicula libero, quis iaculis mauris. Praesent at neque ut dolor pulvinar rutrum vel eget sem. Donec elementum bibendum nunc, a malesuada enim tempus vitae. Proin consequat magna a ante imperdiet, et mattis erat feugiat. Nunc pulvinar molestie aliquam. Aenean dolor sapien, fringilla at gravida in, porta ac nibh. Morbi ut placerat mi, non vehicula nunc. Nam sagittis justo id urna faucibus lacinia. Mauris lacinia libero sed tortor congue egestas. Cras quis lectus odio. Etiam ut ipsum sit amet risus imperdiet cursus.</p>
        </v-col>
        <v-col cols="12" md="4">
          <p class="caption">Curabitur ultrices pellentesque eros. Vestibulum rhoncus arcu eget nunc facilisis efficitur. Quisque ultrices eros ac ante aliquam vehicula. Donec et interdum nisi, id efficitur ex. Praesent volutpat lectus sapien, vitae imperdiet turpis suscipit quis. Nulla a vehicula libero, quis iaculis mauris. Praesent at neque ut dolor pulvinar rutrum vel eget sem. Donec elementum bibendum nunc, a malesuada enim tempus vitae. Proin consequat magna a ante imperdiet, et mattis erat feugiat. Nunc pulvinar molestie aliquam. Aenean dolor sapien, fringilla at gravida in, porta ac nibh. Morbi ut placerat mi, non vehicula nunc. Nam sagittis justo id urna faucibus lacinia. Mauris lacinia libero sed tortor congue egestas. Cras quis lectus odio. Etiam ut ipsum sit amet risus imperdiet cursus.</p>
        </v-col>
      </v-row>
    </div>
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
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
        },
        {
          src: require('@/assets/slide1.jpg')
        }
      ]
    }
  },
  computed: {
    ...mapState(['auth'])
  }
}
</script>
