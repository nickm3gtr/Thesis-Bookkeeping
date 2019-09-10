<template>
  <nav>
    <v-app-bar flat app class="grey lighten-3">
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="!isAuth" class="toolbar-title">
        <span class="title grey--text text--darken-2">DARBMUPCO</span>
        <span class="hidden-sm-and-down font-weight-light title grey--text text--darken-2">Bookkeeping System</span>
      </v-toolbar-title>
      <v-toolbar-title v-else class="toolbar-title">
        <span class="title font-weight-light grey--text text--darken-2">{{ $route.meta.title }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!isAuth">
        <v-dialog v-model="loginDialog" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn text class="font-weight-light" v-on="on">Login</v-btn>
          </template>
          <LoginDialog
            @close-dialog="close('login')"
            @submit-login="login"
            @submit-loginAdmin="adminLogin"
            @goto-admin="gotoAdmin"/>
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
                <span class="subtitle-1 font-weight-light text-capitalize">
                  {{ auth.user.userName }}
                </span>
                <v-icon right medium>expand_more</v-icon>
              </span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
            >
              <v-list-item-title class="subtitle-2 font-weight-light">Profile</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="logout"
            >
              <v-list-item-title class="subtitle-2 font-weight-light">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer
      app
      dark
      floating
      color="blue-grey darken-1"
      width="260"
      v-if="isAuth"
      v-model="drawer">
      <NavDrawer />
    </v-navigation-drawer>
    <ErrorSnackbar :snackbar="hasError" :text="getError" @close-snackbar="!hasError" />
  </nav>
</template>
<script>
import LoginDialog from '@/components/LoginDialog'
import NavDrawer from '@/components/NavDrawer'
import ErrorSnackbar from '@/components/ErrorSnackbar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Navbar',
  components: {
    LoginDialog,
    ErrorSnackbar,
    NavDrawer
  },
  data () {
    return {
      drawer: true,
      loginDialog: false,
      registerDialog: false,
      width: 200
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
    ...mapActions('auth', ['registerUser', 'loginUser', 'loginAdmin', 'logoutUser']),
    toggleDrawer () {
      this.drawer = true
    },
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
    },
    adminLogin (user) {
      this.loginAdmin(user)
      this.close('login')
    },
    gotoAdmin () {
      this.$router.push('/admin')
      this.loginDialog = true
    },
    logout () {
      this.logoutUser()
      this.$router.push('/')
    }
  }
}
</script>
