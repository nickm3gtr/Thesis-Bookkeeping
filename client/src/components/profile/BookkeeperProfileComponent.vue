<template>
  <div>
    <v-layout>
      <v-flex sm12 md8 offset-md2>
        <v-card outlined class="my-6">
          <v-card-title>
            <v-col cols="12" md="12">
              <span class="title font-weight-light">Profile</span>
            </v-col>
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-dialog v-model="passwordDialog" max-width="500" persistent>
                <v-card>
                  <v-card-title>Change Password</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="$v.currentPassword.$model"
                      :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      @click:append="showCurrentPassword = !showCurrentPassword"
                      label="Current Password"></v-text-field>
                    <v-text-field
                      :error="!$v.newPassword.minLength"
                      :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                      :type="showNewPassword ? 'text' : 'password'"
                      @click:append="showNewPassword = !showNewPassword"
                      v-model="$v.newPassword.$model" label="New Password"></v-text-field>
                    <p class="error--text" v-if="!$v.newPassword.minLength">
                      password must be at least {{$v.newPassword.$params.minLength.min}} letters
                    </p>
                    <v-text-field
                      :error="retypePassword.length>0 && !$v.retypePassword.sameAsPassword"
                      :append-icon="showRetypePassword ? 'visibility' : 'visibility_off'"
                      :type="showRetypePassword ? 'text' : 'password'"
                      @click:append="showRetypePassword = !showRetypePassword"
                      v-model="$v.retypePassword.$model" label="Confirm Password"></v-text-field>
                    <p class="error--text" v-if="retypePassword.length>0 && !$v.retypePassword.sameAsPassword">
                      password must be the same
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="blue darken-1" @click="passwordDialog = false" text>Close</v-btn>
                    <v-btn color="blue darken-1" text @click="changePassword"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <v-row>
              <v-col cols="12" md="9"></v-col>
              <v-col cols="12" md="3">
                <v-btn small text color="primary">
                  Edit Account
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <p>ID: {{bookkeeper.id}}</p>
                <p>Username: {{bookkeeper.userName}}</p>
                <p>Fullname: {{bookkeeper.firstName}} {{bookkeeper.lastName}}</p>
                <p>Branch: {{bookkeeper.branchName}}</p>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn small text color="primary"
                  @click="passwordDialog=true"
                >
                  Change Password
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="text-center">
      <v-snackbar
        v-model="snackbar"
        bottom="bottom"
        color="green"
        :timeout="timeout"
      >
        {{changePasswordMessage}}
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'BookkeeperProfileComponent',
  data () {
    return {
      bookkeeper: '',
      passwordDialog: false,
      currentPassword: '',
      newPassword: '',
      retypePassword: '',
      changePasswordMessage: '',
      snackbar: false,
      timeout: 2000,
      showCurrentPassword: false,
      showNewPassword: false,
      showRetypePassword: false
    }
  },
  methods: {
    ...mapActions('errors', ['getError']),
    clearDialog () {
      this.currentPassword = ''
      this.newPassword = ''
      this.retypePassword = ''
    },
    async changePassword () {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      }
      const changePasswordValue = JSON.stringify({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        retypePassword: this.retypePassword
      })
      try {
        const response = await axios.post(`/api/bookkeepers/change-password/${this.auth.user.id}`,
          changePasswordValue, config)
        this.passwordDialog = false
        this.changePasswordMessage = response.data.msg
        this.snackbar = true
        this.clearDialog()
      } catch (e) {
        this.passwordDialog = false
        this.getError(e.response.data)
      }
    }
  },
  computed: {
    ...mapState(['auth'])
  },
  async mounted () {
    try {
      const response = await axios.get(`/api/bookkeepers/profile/${this.auth.user.id}`)
      this.bookkeeper = response.data[0]
    } catch (e) {
      this.getError(e.response.data)
    }
  },
  validations: {
    currentPassword: {
      required
    },
    newPassword: {
      required,
      minLength: minLength(5)
    },
    retypePassword: {
      sameAsPassword: sameAs('newPassword')
    }
  }
}
</script>
