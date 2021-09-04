<template lang="pug">
v-card#editProfile(style='position: relative')
  v-toolbar(
    color='primary',
    style='position: absolute; top: 0; left: 0; right: 0; z-index: 20',
    dark,
    flat
  ) 
    v-btn(icon, dark, @click='$emit("back")')
      v-icon fas fa-times
    span Editando Perfil
    v-spacer
    v-btn(text, dark, @click='updateProfile', style='letter-spacing: 0') Guardar
  v-sheet.pa-4.pt-12(style='height: 100vh; overflow-y: scroll', color='white')
    .overline.mt-6 Foto de Perfil
    avatar-input(
      @update='updateProfilePicture',
      :preview='user.profile_picture'
    )
    .overline Nombre
    v-text-field(
      v-model='profile.name',
      filled,
      rounded,
      :rules='[usernameCheck]',
      maxlength='30',
      counter
    )
    .overline Biografía
    v-textarea(
      v-model='profile.description',
      filled,
      rounded,
      auto-grow,
      :rows='4',
      value='Creador de Olimaps'
    )
    .overline Redes Sociales
    v-text-field(
      prepend-inner-icon='fab fa-twitter',
      placeholder='Twitter',
      v-model='rrss.twitter',
      :rules='[rules.checkTwitter]'
    )
    v-text-field(
      prepend-inner-icon='fab fa-facebook',
      placeholder='Facebook',
      v-model='rrss.facebook',
      :rules='[rules.checkFacebook]'
    )
    v-text-field(
      prepend-inner-icon='fab fa-instagram',
      placeholder='Instagram',
      v-model='rrss.instagram',
      :rules='[rules.checkInstagram]'
    )
    v-text-field(
      prepend-inner-icon='fab fa-linkedin',
      placeholder='Linkedin',
      v-model='rrss.linkedin',
      :rules='[rules.checkLinkedin]'
    )
    v-text-field(
      prepend-inner-icon='fab fa-tiktok',
      placeholder='Tik Tok',
      v-model='rrss.tiktok',
      :rules='[rules.checkTiktok]'
    )
    v-text-field(
      prepend-inner-icon='fab fa-snapchat',
      placeholder='Snapchat',
      v-model='rrss.snapchat',
      :rules='[rules.checkSnapchat]'
    )
    v-text-field(
      placeholder='Otro enlace',
      v-model='rrss.web',
      :rules='[rules.checkUrl]'
    )
</template>

<script>
import rrssMixin from '@/mixins/rrss'
import avatarInput from '@/components/avatar-input'

export default {
  mixins: [rrssMixin],
  components: {
    avatarInput,
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  data() {
    const rrss = {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      snapchat: '',
      tiktok: '',
      web: '',
    }

    this.$store.state.auth.user.rrss.forEach((social) => {
      rrss[social.type] = social.name
    })

    return {
      profile: {
        name: this.$store.state.auth.user.name,
        description: this.$store.state.auth.user.description,
      },
      rrss,
      usernameCheck: (value) =>
        value.match(
          /^(?=.{5,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        ) || 'Nombre de usuario no válido',
    }
  },
  methods: {
    async updateProfilePicture(img) {
      await this.$store.dispatch('user/updateProfilePicture', img)
    },
    async updateProfile() {
      const updatedData = {}

      if (this.user.name !== this.profile.name)
        updatedData.name = this.profile.name
      if (this.user.description !== this.profile.description)
        updatedData.description = this.profile.description

      updatedData.rrss = []
      for (const type in this.rrss) {
        if (this.rrss[type].length !== 0)
          updatedData.rrss.push({
            type,
            name: this.rrss[type],
          })
      }

      if (
        !(
          Object.keys(updatedData).length === 0 &&
          updatedData.constructor === Object
        )
      ) {
        await this.$store.dispatch('user/updateProfile', updatedData)
      }

      this.$emit('back')
    },
  },
}
</script>
