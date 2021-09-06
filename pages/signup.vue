<template lang="pug">
v-sheet#signup(color='white', style='position: relative; height: 100vh')
  v-layout.pt-3(justify-center, align-center)
    //- img(src='@/assets/olimaps-logo.png', style='width: 36px; height: 36px')
    img(src='@/assets/olimaps-logo-light.png', style='height: 40px')
  .pa-6(v-if='step == "select"')
    .font-weight-black.overline CREAR CUENTA CON
    v-btn.rounded-lg(large, block, @click='phoneSelected')
      v-layout(align-center)
        v-icon.mr-2 far fa-envelope
        .text-capitalize Correo o Teléfono
    v-btn.mt-4.rounded-lg(large, block, @click='openTwitter')
      v-layout(align-center)
        v-icon.mr-2 fab fa-twitter
        .text-capitalize Twitter
    v-btn.mt-4.rounded-lg(large, block, disabled)
      v-layout(align-center)
        v-icon.mr-2 fab fa-instagram
        .text-capitalize Instagram
    v-layout.pa-2(style='position: absolute; bottom: 0; left: 0; right: 0')
      v-btn(block, outlined, large, @click='openLogin') Ya tengo cuenta
  .pa-6(v-if='step == "email"')
    v-tabs(v-model='tab', fixed-tabs, background-color='white')
      v-tab(key='phone') Telefono
      v-tab(key='email') Correo
    v-tabs-items.mt-4(v-model='tab', style='background-color: transparent')
      v-tab-item(key='phone', style='height: calc(100vh - 140px)')
        .font-weight-black TELÉFONO
        v-phone-input.mt-2(v-model='phone')
        v-checkbox.mt-4(
          color='primary',
          label='Acepto recibir un SMS para que Olimaps pueda verificar mi número de teléfono'
        )
        v-checkbox(
          color='primary',
          label='Acepto los términos y condiciones de Olimaps'
        )
        v-layout.pa-2(
          style='position: absolute; bottom: 0; left: 0; right: 0',
          justify-space-between
        )
          v-btn(outlined, large, @click='step = "select"') Atrás
          v-btn#signup-button(color='primary', large) Siguiente
      v-tab-item(key='email', style='height: calc(100vh - 140px)')
        .font-weight-black EMAIL
        v-text-field.mt-2(
          v-model='email',
          dense,
          rounded,
          filled,
          placeholder='E-Mail',
          append-icon='fas fa-envelope',
          :rules='[checkEmail]'
        )
        v-checkbox.mt-4(
          color='primary',
          label='Acepto recibir un SMS para que Olimaps pueda verificar mi número de teléfono'
        )
        v-checkbox(
          color='primary',
          label='Acepto los términos y condiciones de Olimaps'
        )
        v-layout.pa-2(
          style='position: absolute; bottom: 0; left: 0; right: 0',
          justify-space-between
        )
          v-btn(outlined, large, @click='step = "select"') Atrás
          v-btn(color='primary', large, @click='signupByEmail') Siguiente
  .pa-6(v-if='step == "phoneVerification"')
    .font-weight-black CÓDIGO DE VERIFICACION
    v-text-field.mt-2(
      v-model='phoneVerificationCode',
      dense,
      rounded,
      type='number',
      filled,
      placeholder='Código'
    )
    v-layout.pa-2(
      style='position: absolute; bottom: 0; left: 0; right: 0',
      justify-space-between
    )
      //- v-btn(outlined, large, @click='step = "select"') Atrás
      v-spacer
      v-btn(color='primary', large, @click='confirmVerificationCode') Siguiente
  .pa-6(v-if='step == "password"')
    .font-weight-black CONTRASEÑA
    span Crea una contraseña nueva
    v-text-field.mt-2(
      v-model='password',
      dense,
      hide-details,
      rounded,
      filled,
      :type='showPassOnLogin ? "" : "password"',
      @click:append='showPassOnLogin = !showPassOnLogin',
      :append-icon='showPassOnLogin ? "fas fa-eye-slash" : "fas fa-eye"'
    )
    v-layout
      v-icon.mr-2(small, :color='checkPassLength ? "green" : "black"') far {{ checkPassLength ? "fa-check-circle" : "fa-circle" }}
      span Mínimo 8 carácteres
    v-layout
      v-icon.mr-2(small, :color='checkPassFormat ? "green" : "black"') far {{ checkPassFormat ? "fa-check-circle" : "fa-circle" }}
      span Debe incluir mayúsculas y números
    v-layout.pa-2(
      style='position: absolute; bottom: 0; left: 0; right: 0',
      justify-end
    )
      v-btn(
        color='primary',
        large,
        :disabled='!checkPassFormat',
        @click='updatePassword'
      ) Siguiente
  .pa-6(v-if='step == "avatar"')
    .font-weight-black TUS DATOS
    v-layout(align-center)
      avatar-input(
        @update='updateProfilePicture',
        :preview='user.profile_picture'
      )
      v-text-field.mt-6(
        dense,
        maxlength='30',
        counter,
        rounded,
        filled,
        v-model='user.username',
        :rules='[usernameCheck]'
      )
    span.mt-8 Puedes cambiar tu avatar y tu nombre de usuario más adelante
    .font-weight-black.mt-6 BIOGRAFÍA
    v-textarea.mt-2(
      v-model='description',
      filled,
      rounded,
      auto-grow,
      :rows='4',
      placeholder='Cuentanos algo sobre ti'
    )
    v-layout.pa-2(
      style='position: absolute; bottom: 0; left: 0; right: 0',
      justify-space-between
    )
      v-spacer
      v-btn(color='primary', large, @click='updateProfile') Siguiente
  .pa-6(v-if='step == "rrss"')
    .font-weight-black REDES SOCIALES
    ul
      li La gente podrá echar un vistazo a tus Redes Sociales
      li Podrás iniciar sesión en Olimaps con tus otras cuentas
      li Encuentra a tus amigos en Olimaps
      li Tus publicaciones automaticamente podrán estar en Olimaps
    v-card.px-4.py-2.mt-4.rounded-xl(color='#00acee', dark)
      v-layout
        v-icon(x-small) fab fa-twitter
        v-subheader.pl-2 Twitter
      v-btn(rounded, block, color='white', light, @click='connectTwitter') Conectar
    //- v-card.px-4.py-2.mt-4.rounded-xl(color='#ef426f', dark)
      v-layout
        v-icon(x-small) fab fa-instagram
        v-subheader.pl-2 Instagram
      v-btn(rounded, block, color='white', light) Conectar
    v-layout.pa-2(
      style='position: absolute; bottom: 0; left: 0; right: 0',
      justify-space-between
    )
      v-spacer
      v-btn(color='primary', large, @click='$router.replace({ path: "/" })') Finalizar
</template>

<script>
import avatarInput from '@/components/avatar-input'

export default {
  head: {
    title: 'Registrate | Olimaps',
  },
  data() {
    return {
      tab: 'phone',
      email: '',
      password: '',
      description: '',
      phone: '',
      phoneVerificationCode: null,
      step: 'select',
      showPassOnLogin: false,
      checkEmail: (email) =>
        email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        ) || 'El email no tiene un formato válido',
      usernameCheck: (value) =>
        value.match(
          /^(?=.{5,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        ) || 'Nombre de usuario no válido',
    }
  },
  components: {
    avatarInput,
    'v-phone-input': () => import('@/components/phoneInput'),
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    checkPassLength() {
      return this.password.length >= 8
    },
    checkPassFormat() {
      return this.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      )
    },
  },
  mounted() {
    if (this.$store.getters['auth/authenticated']) {
      this.$router.replace({ path: '/' })
    }
  },
  methods: {
    openLogin() {
      this.$store.commit('setLogin', true)
    },
    phoneSelected() {
      this.step = 'email'
      this.$fire.auth.languageCode = 'es'

      setTimeout(() => {
        const self = this

        // Start Firebase invisible reCAPTCHA verifier
        window.recaptchaVerifier = new this.$fireModule.auth.RecaptchaVerifier(
          'signup-button',
          {
            size: 'invisible',
            badge: 'bottomleft',
            callback: () => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              console.log('CAPTCHA solved')
              const appVerifier = window.recaptchaVerifier
              this.$fire.auth
                .signInWithPhoneNumber(this.phone, appVerifier)
                .then((confirmationResult) => {
                  window.confirmationResult = confirmationResult
                  console.log('SMS Enviado')
                  this.step = 'phoneVerification'
                })
                .catch((error) => {
                  console.error(error)
                  // Error; SMS not sent
                  // ...
                })
            },
            'expired-callback': () => {
              alert('El CAPTCHA no se ha resuelto correctamente')
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            },
          }
        )

        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId
        })
      }, 500)
    },
    confirmVerificationCode() {
      window.confirmationResult
        .confirm(this.phoneVerificationCode)
        .then((result) => {
          // User signed in successfully.
          console.log('USUARIO VERIFICADO', result.user)
          this.signupByPhone()
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
        })
    },
    openTwitter() {
      window.location.href = `${process.env.SERVER_URL}/auth/twitter`
    },
    async signupByPhone() {
      try {
        await this.$store.dispatch('auth/signupByPhone', {
          phone: this.phone,
        })
        this.step = 'password'
      } catch (err) {
        console.error(err)
      }
    },
    async signupByEmail() {
      try {
        await this.$store.dispatch('auth/signupByEmail', {
          email: this.email,
        })
        this.step = 'password'
      } catch (err) {
        console.error(err)
      }
    },
    async updatePassword() {
      try {
        await this.$store.dispatch('auth/updatePassword', this.password)
        this.step = 'avatar'
      } catch (err) {
        console.error(err)
      }
    },
    async updateProfilePicture(img) {
      await this.$store.dispatch('user/updateProfilePicture', img)
    },
    async updateProfile() {
      try {
        const updatedData = {}

        if (this.user.name !== this.user.username) {
          updatedData.name = this.user.username
          updatedData.username = this.user.username
        }
        if (this.user.description !== this.description)
          updatedData.description = this.description

        await this.$store.dispatch('user/updateProfile', updatedData)

        this.step = 'rrss'
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style>
.grecaptcha-badge {
  bottom: 200px !important;
}
</style>
