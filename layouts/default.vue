<template lang="pug">
  v-app
    v-slide-x-reverse-transition
      nuxt(keep-alive)
    v-bottom-sheet(v-model="bottomSheetOpened")
      login
</template>

<script>
export default {
  components: {
    login: () => import('../components/login/login.vue'),
  },
  data: () => ({
    centre: [0, 0],
  }),
  computed: {
    loginOpened() {
      return this.$store.state.loginOpened
    },
    bottomSheetOpened: {
      get() {
        return this.loginOpened
      },
      set() {
        this.$store.commit('disableAllWindows')
      },
    },
  },
  mounted() {
    navigator.geolocation.watchPosition(function (position) {
      this.centre[0] = position.coords.latitude
      this.centre[1] = position.coords.longitude
    })
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin&family=Cabin:wght@200;400;500;600;700&display=swap');
$body-font-family: 'Cabin';

.v-application {
  font-family: $body-font-family, sans-serif !important;
}

html {
  font-family: $body-font-family, 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
</style>
