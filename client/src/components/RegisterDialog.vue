<template>
  <v-card class="elevation-12">
    <v-toolbar flat dark class="green">
      <v-toolbar-title>Register</v-toolbar-title>
    </v-toolbar>
    <v-form @submit.prevent="handleSubmit">
      <v-card-text>
        <v-text-field v-model="user.firstName" label="First name" name="firstName" type="text"></v-text-field>
        <v-text-field v-model="user.lastName" label="Last name" name="lastName" type="text"></v-text-field>
        <v-text-field v-model="user.email" label="Email" name="email" type="email"></v-text-field>
        <v-text-field v-model="user.password" label="Password" name="password" type="password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close-dialog')">
          <span>Close</span>
        </v-btn>
        <v-btn text color="success" @click="submit(user)">
          <span>Submit</span>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
export default {
  name: 'RegisterDialog',
  data () {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submit (user) {
      this.$emit('submit-register', user)
      this.user.firstName = ''
      this.user.lastName = ''
      this.user.email = ''
      this.user.password = ''
    }
  }
}
</script>
