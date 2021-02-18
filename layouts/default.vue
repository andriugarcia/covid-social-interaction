<template lang="pug">
  v-app
    home
</template>

<script>
import Home from '../components/home/home'
export default {
  components: {
    Home,
  },
  data: () => ({
    centre: [0, 0],
  }),
  mounted() {
    navigator.geolocation.watchPosition(function (position) {
      this.centre[0] = position.coords.latitude
      this.centre[1] = position.coords.longitude
    })
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@300400500700&display=swap');
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

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--primary {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--primary:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
