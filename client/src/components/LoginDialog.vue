<template>
  <v-card>
    <v-toolbar flat dark color="blue-grey darken-1">
      <v-toolbar-title v-if="isAdmin">Admin Login</v-toolbar-title>
      <v-toolbar-title v-else>Bookkeeper Login</v-toolbar-title>
    </v-toolbar>
    <v-form @submit.prevent="submit(user)">
      <v-card-text>
        <v-text-field v-model="user.userName" label="Username" name="username" type="text"></v-text-field>
        <v-text-field v-model="user.password" label="Password" name="password" type="password"></v-text-field>
      </v-card-text>
      <span
        v-if="!isAdmin"
        @click="$emit('goto-admin')"
        class="blue--text
        link
        darken-4
        subtitle-2
        ml-5 font-weight-light">
        Click here to sign in as admin
      </span>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close-dialog')">
          <span>Close</span>
        </v-btn>
        <v-btn
          type="submit"
          text color="blue-grey darken-1">
          <span>Submit</span>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'LoginDialog',
  data () {
    return {
      user: {
        userName: '',
        password: ''
      }
    }
  },
  computed: {
    isAdmin () {
      return this.$route.name === 'homeAdmin'
    }
  },
  methods: {
    submit (user) {
      if (this.$route.name === 'homeAdmin') {
        this.$emit('submit-loginAdmin', user)
      } else {
        this.$emit('submit-login', user)
      }
      this.user.userName = ''
      this.user.password = ''
    }
  }
}
</script>

<style scoped>
  .link {
    text-decoration: underline;
    cursor: pointer;
  }
  .link:hover {
    background-color: #eeeeee;
  }
</style>
