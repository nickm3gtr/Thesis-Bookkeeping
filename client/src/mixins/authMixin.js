export default {

  beforeCreate () {
    this.$store.dispatch('auth/loadUser')
  }
}
