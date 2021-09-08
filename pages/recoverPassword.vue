<template lang="pug">
v-sheet#recover(color='white', style='position: relative; height: 100vh')
  v-layout.pt-3(justify-center, align-center)
    img(src='@/assets/olimaps-logo-light.png', style='height: 40px')
  .pa-6(v-if='!updatePasswordMode')
    .font-weight-black.overline RECUPERAR CONTRASEÑA
    v-text-field(
      v-model='email',
      label='E-mail',
      placeholder='Introduce tu correo'
    )
    p Si existe un usuario con ese correo, te enviaremos un correo con un enlace para recuperar tu cuenta.
    v-btn(block, tile, color='primary', @click='recoverPassword') Recuperar Contraseña
  .pa-6(v-else)
    .font-weight-black CONTRASEÑA
    span Crea una contraseña nueva
    v-text-field.mt-2(
      v-model='password',
      dense,
      hide-details,
      rounded,
      filled,
      :type='showPass ? "" : "password"',
      @click:append='showPass = !showPass',
      :append-icon='showPass ? "fas fa-eye-slash" : "fas fa-eye"'
    )
    v-layout
      v-icon.mr-2(small, :color='checkPassLength ? "green" : "black"') far {{ checkPassLength ? "fa-check-circle" : "fa-circle" }}
      span Mínimo 8 carácteres
    v-layout
      v-icon.mr-2(small, :color='checkPassFormat ? "green" : "black"') far {{ checkPassFormat ? "fa-check-circle" : "fa-circle" }}
      span Debe incluir mayúsculas y números
    v-btn.mt-6(
      block,
      tile,
      color='primary',
      :disabled='!checkPassLength || !checkPassFormat',
      @click='updatePassword'
    ) Actualizar Contraseña
    v-alert(v-if='updatePasswordError', text, type='error') Ha habido un error actualizando la contraseña
</template>

<script>
export default {
  data() {
    return {
      email: null,
      updatePasswordMode: false,
      password: '',
      showPass: false,
      updatePasswordError: false,
    }
  },
  computed: {
    checkPassLength() {
      return this.password.length >= 8
    },
    checkPassFormat() {
      return this.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      )
    },
  },
  methods: {
    recoverPassword() {
      this.$store.dispatch('auth/recoverPassword', this.email)
    },
    async updatePassword() {
      this.updatePasswordError = false
      this.$store.commit('auth/setLoginToken', this.$route.query.token)
      try {
        await this.$store.dispatch('auth/getMe')
        await this.$store.dispatch('auth/updatePassword', this.password)
        this.$router.replace({ path: '/' })
      } catch (e) {
        this.updatePasswordError = true
      }
    },
  },
  mounted() {
    if (typeof this.$route.query.token !== 'undefined') {
      this.updatePasswordMode = true
    }
  },
}
</script>