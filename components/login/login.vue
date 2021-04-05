<template lang="pug">
  v-card#login.pa-6(color="primary", dark)
    div(v-if="type == 'signup'")
      span(style="font-size: 2em") Crear Cuenta
      v-text-field(v-model="signupData.username", label="Username")
      v-text-field(v-model="signupData.email", label="Email", type="email")
      v-text-field(v-model="signupData.password", label="Password", type="password", :type="showPassOnSignup ? '' : 'password'", @click:append="showPassOnSignup = !showPassOnSignup", :append-icon="showPassOnSignup ? 'fas fa-eye-slash' : 'fas fa-eye'")
      v-btn.mt-2(color="white", light, block, rounded, @click="signup") Registrate
      v-layout.mt-6(align-center)
        .font-weight-bold.mr-4 Tienes ya una cuenta?
        v-btn.text-capitalize(small, text, @click="type = 'login'") Iniciar Sesion
    div(v-else)
      span(style="font-size: 2em") Iniciar Sesión
      v-text-field(v-model="loginData.email", label="Email", type="email")
      v-text-field(v-model="loginData.password", label="Password", :type="showPassOnLogin ? '' : 'password'", @click:append="showPassOnLogin = !showPassOnLogin", :append-icon="showPassOnLogin ? 'fas fa-eye-slash' : 'fas fa-eye'")
      v-btn.mt-2(color="white", light, block, rounded, @click="login") Iniciar Sesión
      v-layout.mt-6(align-center)
        .font-weight-bold.mr-4 No tienes Cuenta?
        v-btn.text-capitalize(small, text, @click="type = 'signup'") Crear Cuenta

</template>

<script>
export default {
  data: () => ({
    type: 'signup',
    showPassOnLogin: false,
    showPassOnSignup: false,
    loginData: {
      email: '',
      password: '',
    },
    signupData: {
      username: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    async login() {
      if (await this.$store.dispatch('auth/login', this.loginData)) {
        this.$store.commit('setLogin', false)
      }
    },
    async signup() {
      if (await this.$store.dispatch('auth/signup', this.signupData)) {
        this.$store.commit('setLogin', false)
      }
    },
  },
}
</script>
