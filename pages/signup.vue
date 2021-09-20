<template lang="pug">
v-sheet#signup(color='white', style='position: relative; height: 100vh')
  v-layout.pt-3(justify-center, align-center)
    //- img(src='@/assets/olimaps-logo.png', style='width: 36px; height: 36px')
    img(src='@/assets/olimaps-logo-light.png', style='height: 40px')
  v-sheet.mt-3.pa-6(
    v-if='step == "introduction"',
    color='secondary',
    style='height: 100%'
  )
    v-stepper.elevation-0(
      v-model='introductionStep',
      style='background-color: transparent',
      flat
    )
      v-stepper-items
        v-stepper-content.pa-3.rounded-lg.elevation-0(
          step='1',
          style='height: 100%; width: 100%; max-height: 600px'
        )
          v-layout(column, justify-center, align-center)
            img(src='@/assets/spread.png', style='height: 300px')
            .heading-6.font-weight-black.mt-8 DESCUBRE
            p.mx-8.text-center.black--text.text--secondary Qué esta ocurriendo cerca de ti y conoce a gente con la que puedas hacer planes
        v-stepper-content.pa-3.rounded-lg.elevation-0(
          step='2',
          style='height: 100%; width: 100%; max-height: 600px'
        )
          v-layout(column, justify-center, align-center)
            img(src='@/assets/event.png', style='height: 300px')
            .heading-6.font-weight-black.mt-8 PARTICIPA
            p.mx-8.text-center.black--text.text--secondary Descubre eventos en tu ciudad y disfruta conociendo a gente nueva
        v-stepper-content.pa-3.rounded-lg.elevation-0(
          step='3',
          style='height: 100%; width: 100%; max-height: 600px'
        )
          v-layout(column, justify-center, align-center)
            img(src='@/assets/chat.png', style='height: 300px')
            .heading-6.font-weight-black.mt-8 CHATEA
            p.mx-8.text-center.black--text.text--secondary Habla con la gente que vayas conociendo
    .pa-2(style='position: absolute; bottom: 0; left: 0; right: 0')
      v-btn.mb-2.black--text(
        color='secondary darken-1',
        depressed,
        block,
        large,
        @click='openLogin'
      ) Ya Tengo Cuenta
      v-layout.pa-2(justify-space-between)
        v-btn(
          fab,
          color='#000000',
          large,
          dark,
          depressed,
          small,
          :disabled='introductionStep <= 1',
          @click='introductionStep -= 1'
        )
          v-icon(small) fas fa-chevron-left
        v-layout(justify-center, align-center)
          v-avatar(
            size='8',
            :color='introductionStep == 1 ? "#000000" : "yellow darken-3"'
          )
          v-avatar.mx-1(
            size='8',
            :color='introductionStep == 2 ? "#000000" : "yellow darken-3"'
          )
          v-avatar(
            size='8',
            :color='introductionStep == 3 ? "#000000" : "yellow darken-3"'
          )
        v-btn(
          fab,
          large,
          color='#000000',
          dark,
          depressed,
          small,
          @click='nextIntroductionStep'
        )
          v-icon(small) fas fa-chevron-right
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
      v-btn(block, color='primary', dark, large, @click='openLogin') Ya tengo cuenta
  .pa-6(v-if='step == "email"')
    v-tabs(v-model='tab', fixed-tabs, background-color='white')
      v-tab(key='phone') Telefono
      v-tab(key='email') Correo
    v-tabs-items.mt-4(v-model='tab', style='background-color: transparent')
      v-tab-item(key='phone', style='height: calc(100vh - 140px)')
        .font-weight-black TELÉFONO
        v-phone-input.mt-2(v-model='phone')
        v-checkbox(
          v-model='termsCheck',
          color='primary',
          label='Acepto los términos y condiciones de Olimaps'
        )
        v-layout.pa-2(
          style='position: absolute; bottom: 0; left: 0; right: 0',
          justify-space-between
        )
          v-btn(outlined, large, @click='step = "select"') Atrás
          v-btn#signup-button(color='primary', :disabled='!termsCheck', large) Siguiente
      v-tab-item(key='email', style='height: calc(100vh - 140px)')
        .font-weight-black EMAIL
        v-text-field.mt-2(
          name='email',
          v-model='email',
          dense,
          rounded,
          filled,
          placeholder='E-Mail',
          append-icon='fas fa-envelope',
          :rules='[checkEmail]'
        )
        v-checkbox.mt-4(
          v-model='smsVerificationCheck',
          color='primary',
          label='Acepto recibir un SMS para verificar mi número de teléfono'
        )
        v-checkbox(
          v-model='termsCheck',
          color='primary',
          label='Acepto los términos y condiciones de Olimaps'
        )
        v-layout.pa-2(
          style='position: absolute; bottom: 0; left: 0; right: 0',
          justify-space-between
        )
          v-btn(outlined, large, @click='step = "select"') Atrás
          v-btn(
            color='primary',
            large,
            :disabled='!smsVerificationCheck || !termsCheck',
            @click='signupByEmail'
          ) Siguiente
  .pa-6(v-if='step == "phoneVerification"')
    .font-weight-black CÓDIGO DE VERIFICACION
    v-text-field.mt-2(
      name='phone',
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
      name='password',
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
        name='username',
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
      v-btn(color='primary', large, @click='checkNotifications') Siguiente
  .pa-6(v-if='step == "notifications"')
    push-alert(@enabled='$router.replace({ path: "/" })')
    v-layout.pa-2(
      style='position: absolute; bottom: 0; left: 0; right: 0',
      justify-space-between
    )
      v-spacer
      v-btn(color='primary', large, @click='$router.replace({ path: "/" })') Omitir
</template>

<script>
import avatarInput from '@/components/avatar-input'
import pushAlert from '@/components/pushAlert'

export default {
  head: {
    title: 'Registrate | Olimaps',
  },
  data() {
    return {
      tab: 'phone',
      introductionStep: 1,
      email: '',
      password: '',
      description: '',
      phone: '',
      phoneVerificationCode: null,
      smsVerificationCheck: false,
      termsCheck: false,
      step: 'introduction',
      showPassOnLogin: false,
      checkEmail: (email) =>
        email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        ) || 'El email no tiene un formato válido',
      usernameCheck: (value) =>
        value.match(
          /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/
        ) || 'Nombre de usuario no válido',
    }
  },
  components: {
    avatarInput,
    pushAlert,
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
    if (this.$store.getters['auth/sauthenticated']) {
      this.$router.replace({ path: '/' })
    }
  },
  methods: {
    nextIntroductionStep() {
      if (this.introductionStep < 3) {
        this.introductionStep += 1
      } else {
        this.step = 'select'
      }
    },
    openLogin() {
      this.$store.commit('setLogin', true)
    },
    checkNotifications() {
      if (this.$store.state.auth.pushAvailable) {
        this.step = 'notifications'
      } else {
        this.$router.replace({ path: '/' })
      }
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
