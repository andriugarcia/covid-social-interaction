export default {
  methods: {
    openLoginIfNotAuthenticated() {
      if (!this.$store.getters['auth/authenticated']) {
        this.$store.commit('setLogin', true)
        return true
      } else {
        return false
      }
    },
  },
}
