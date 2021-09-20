<template lang="pug">
v-card#login.pa-6(color='primary', dark)
  div(v-if='type == "signup"')
    span(style='font-size: 2em') Crear Cuenta
    v-text-field(
      v-model='signupData.username',
      name='username',
      label='Username'
    )
    v-text-field(
      v-model='signupData.email',
      name='email',
      label='Email',
      type='email'
    )
    v-text-field(
      v-model='signupData.password',
      name='password',
      label='Password',
      type='password',
      :type='showPassOnSignup ? "" : "password"',
      @click:append='showPassOnSignup = !showPassOnSignup',
      :append-icon='showPassOnSignup ? "fas fa-eye-slash" : "fas fa-eye"'
    )
    v-btn.mt-2(color='white', light, block, rounded, @click='signup') Registrate
    v-layout.mt-6(align-center)
      .font-weight-bold.mr-4 Tienes ya una cuenta?
      v-btn.text-capitalize(small, text, @click='type = "login"') Iniciar Sesion
  div(v-else-if='type == "login"')
    span(style='font-size: 2em') Iniciar Sesión
    v-tabs(v-model='tab', background-color='primary', fixed-tabs)
      v-tab(key='phone') Teléfono
      v-tab(key='email') Email
    v-tabs-items(v-model='tab', style='background-color: transparent')
      v-tab-item(key='phone')
        v-phone-input.mt-6(v-model='loginData.phone')
        v-text-field(
          v-model='loginData.password',
          dark,
          label='Password',
          name='password',
          :type='showPassOnLogin ? "" : "password"',
          @click:append='showPassOnLogin = !showPassOnLogin',
          @keydown.enter='loginPhone',
          :append-icon='showPassOnLogin ? "fas fa-eye-slash" : "fas fa-eye"'
        )
        v-layout(v-if='loginPhoneError', column, align-center)
          v-icon(large, block) fas fa-exclamation-circle
          span Teléfono o Contraseña incorrecto
          v-divider(color='white')
        v-btn#login-button.mt-2(
          color='white',
          light,
          block,
          :loading='loading',
          rounded,
          @click='loginPhone'
        ) Iniciar Sesión
      v-tab-item(key='email')
        v-text-field(
          v-model='loginData.email',
          name='email',
          label='Email o Nombre de Usuario',
          type='email',
          dark,
          append-icon='fas fa-envelope'
        )
        v-text-field(
          v-model='loginData.password',
          name='password',
          label='Password',
          dark,
          :type='showPassOnLogin ? "" : "password"',
          @click:append='showPassOnLogin = !showPassOnLogin',
          @keydown.enter='loginPhone',
          :append-icon='showPassOnLogin ? "fas fa-eye-slash" : "fas fa-eye"'
        )
        v-layout(v-if='loginError', column, align-center)
          v-icon(large, block) fas fa-exclamation-circle
          span Usuario o Contraseña incorrecto
          v-divider(color='white')
        v-btn.mt-2(
          color='white',
          light,
          block,
          :loading='loading',
          rounded,
          @click='login'
        ) Iniciar Sesión
    v-layout.my-4(justify-center)
      v-btn.white--text.text-capitalize(
        text,
        @click='openRecover',
        style='letter-spacing: 0'
      ) Recuperar Contraseña
    .white--text O puedes acceder con:
    v-layout.mt-2
      v-btn.mr-2(fab, color='white', @click='openTwitter')
        v-icon(color='#00acee') fab fa-twitter
      v-btn(fab, color='white', disabled)
        v-icon(color='#ef426f') fab fa-instagram
    v-divider.my-3(color='white')
    v-card.pa-2.rounded-lg(outlined, light, color='white', @click='openSignup')
      v-layout(align-center, justify-space-between)
        .primary--text.font-weight-bold.mr-4 No tienes Cuenta? 😱
        v-btn.rounded-lg.text-capitalize(
          dark,
          small,
          depressed,
          color='primary'
        ) REGISTRATE
</template>

<script>
import phoneInput from '@/components/phoneInput'
export default {
  components: {
    'v-phone-input': phoneInput,
  },
  data: () => ({
    type: 'login',
    tab: 'phone',
    showPassOnLogin: false,
    showPassOnSignup: false,
    loginError: false,
    loginPhoneError: false,
    loading: false,
    loginData: {
      email: '',
      phone: '',
      password: '',
    },
    signupData: {
      username: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    openTwitter() {
      window.location.href = `${process.env.SERVER_URL}/auth/twitter`
    },
    async login() {
      this.loginError = false
      this.loading = true
      if (await this.$store.dispatch('auth/login', this.loginData)) {
        this.$store.commit('setLogin', false)
        if (this.$route.name == 'signup') this.$router.replace({ path: '/' })
      } else {
        this.loginError = true
      }
      this.loading = false
    },
    async loginPhone() {
      this.loginPhoneError = false
      this.loading = true
      if (await this.$store.dispatch('auth/loginPhone', this.loginData)) {
        this.$store.commit('setLogin', false)
        if (this.$route.name == 'signup') this.$router.replace({ path: '/' })
      } else {
        this.loginPhoneError = true
      }
      this.loading = false
    },
    openRecover() {
      this.$router.push({ path: '/recoverPassword' })
      this.$store.commit('setLogin', false)
    },
    openSignup() {
      this.$router.push({ path: '/signup' })
      this.$store.commit('setLogin', false)
    },
    async signup() {
      if (await this.$store.dispatch('auth/signup', this.signupData)) {
        this.$store.commit('setLogin', false)
      }
    },
  },
}
</script>
