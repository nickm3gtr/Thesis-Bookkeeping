<template>
  <nav>
    <v-app-bar flat app class="grey lighten-3">
      <v-toolbar-title v-if="!isAuth" class="toolbar-title" @click="$router.push('/')">
        <span class="headline grey--text text--darken-2">DARBMUPCO</span>
        <span class="font-weight-light headline grey--text text--darken-2">Bookkeeping System</span>
      </v-toolbar-title>
      <v-toolbar-title v-else class="toolbar-title">
        <span class="headline grey--text text--darken-2">{{ $route.meta.title }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!isAuth">
        <v-dialog v-model="registerDialog" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn text class="font-weight-light" v-on="on">Register</v-btn>
          </template>
          <RegisterDialog @close-dialog="close('register')" @submit-register="register"/>
        </v-dialog>
        <v-dialog v-model="loginDialog" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn text class="font-weight-light" v-on="on">Login</v-btn>
          </template>
          <LoginDialog @close-dialog="close('login')" @submit-login="login" />
        </v-dialog>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-menu
          :offset-x="true"
          :offset-y="true"
          transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              <span class="grey--text text--darken-2">
                <span class="title font-weight-light text-capitalize">
                  {{ auth.user.lastName }}, {{ auth.user.firstName }}
                </span>
                <v-icon right medium>expand_more</v-icon>
              </span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
            >
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="logout"
            >
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer app expand-on-hover dark class="green py-5" v-if="isAuth" v-model="drawer">
      <NavDrawer />
    </v-navigation-drawer>
    <ErrorSnackbar :snackbar="hasError" :text="getError" @close-snackbar="!hasError" />
  </nav>
</template>
<script>
import RegisterDialog from '@/components/RegisterDialog'
import LoginDialog from '@/components/LoginDialog'
import NavDrawer from '@/components/NavDrawer'
import ErrorSnackbar from '@/components/ErrorSnackbar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Navbar',
  components: {
    RegisterDialog,
    LoginDialog,
    ErrorSnackbar,
    NavDrawer
  },
  data () {
    return {
      drawer: true,
      loginDialog: false,
      registerDialog: false
    }
  },
  computed: {
    ...mapState(['auth', 'errors']),
    isAuth () {
      return !!(this.auth.user && this.auth.isAuthenticated === true)
    },
    hasError () {
      return this.errors.isError === true
    },
    getError () {
      return this.errors.msg.msg
    }
  },
  methods: {
    ...mapActions('auth', ['registerUser', 'loginUser', 'logoutUser']),
    close (val) {
      if (val === 'register') {
        this.registerDialog = false
      } else {
        this.loginDialog = false
      }
    },
    register (user) {
      this.registerUser(user)
      this.close('register')
    },
    login (user) {
      this.loginUser(user)
      this.close('login')
      this.$router.push('/dashboard')
    },
    logout () {
      this.logoutUser()
      this.$router.push('/')
    }
  }
}
</script>
