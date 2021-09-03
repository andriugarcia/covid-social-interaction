<template lang="pug">
#chat(style='position: relative; width: 100%; height: 100%')
  #conversation(v-if='!groupinfo')
    div(style='position: absolute; top: 0; left: 0; right: 0; z-index: 10')
      v-toolbar(flat, color='text')
        //- v-icon.mr-4(color="primary") fas fa-street-view
        v-btn.mr-2(
          icon,
          dark,
          small,
          @click='$router.replace({ path: "/chat" })'
        )
          v-icon fas fa-chevron-left
        v-spacer
        v-avatar(color='primary')
          v-img(:src='chat.cover')
        .ml-2(@click='openGroup', style='width: 100%')
          .background--text.font-weight-bold {{ chat.title }}
          span.white--text(v-if='chat.member') {{ chat.member.length | formatNumber }} participantes
        v-spacer
        v-btn(icon, dark, @click='shareDialog = true')
          v-icon fas fa-share-alt
        v-menu(offset-y)
          template(v-slot:activator='{ on }')
            v-btn(icon, dark, v-on='on')
              v-icon fas fa-ellipsis-v
          v-card
            v-list
              v-list-item(
                v-if='chat.about && !chat.about.muted',
                @click='muteChat'
              )
                v-list-item-avatar
                  v-icon fas fa-volume-mute
                v-list-item-content Silenciar Grupo
              v-list-item(v-else, @click='unmuteChat')
                v-list-item-avatar
                  v-icon fas fa-bell
                v-list-item-content Activar Notificaciones
              v-dialog(v-if='isParticipant', v-model='leaveDialogOut')
                template(v-slot:activator='{ on }')
                  v-list-item(v-on='on')
                    v-list-item-avatar
                      v-icon.red--text fas fa-sign-out-alt
                    v-list-item-title.red--text Salir del grupo
                v-card.pa-2
                  .overline SALIR DEL GRUPO
                  p.text-center ¿De verdad quieres salir del grupo?
                  v-layout(justify-space-between)
                    v-btn(text, @click='leaveDialogOut = false') Cancelar
                    v-btn(color='red', @click='leaveGroup()', dark, depressed) Salir
      v-card(
        v-if='chat.event && chat.event.length != 0',
        flat,
        tile,
        color='primary'
      )
        v-list-item(
          @click='$router.push({ path: `/events/${chat.event[0].event_id}` })'
        )
          v-list-item-avatar(color='white')
            span(style='font-size: 1.6em') {{ chat.event[0].emoji }}
          v-list-item-content
            span.font-weight-bold {{ chat.event[0].title }}
            span {{ chat.event[0].start_date | toDateShort }}
          v-list-item-action
            v-btn(small, depressed, color='primary darken-1') ASISTIR
    v-sheet(color='white', style='position: relative')
      messages(v-if='chatLoaded')
    div(style='position: absolute; bottom: 0px; left: 0; right: 0')
      chat-bar(v-if='isParticipant', :chat='chat')
      v-btn(v-else, block, tile, large, color='primary', @click='joinChat') UNIRME
  v-sheet#chat-settings.px-6(
    v-else-if='settingsOpened',
    color='white',
    style='height: 100%'
  )
    v-layout.pa-4(
      justify-space-between,
      align-center,
      @click='settingsOpened = false'
    )
      v-btn(small, outlined, @click='settingsOpened = false') Cancelar
      v-btn(small, outlined, @click='updateChat()') Hecho
    avatar-input(@update='updateCover', :preview='chat.cover')
    .overline.mt-4 Nombre
    v-text-field(v-model='chat.title', filled, rounded)
    .overline Descripción
    v-text-field(v-model='chat.description', filled, rounded)
  v-sheet#chat-info(v-else, color='white', style='height: 100vh')
    v-layout.pa-4(justify-space-between, align-center)
      v-btn(icon, @click='groupinfo = false')
        v-icon fas fa-arrow-left
      v-btn.mr-2(v-if='isAdmin', icon, small, @click='settingsOpened = true')
        v-icon fas fa-pen
    v-layout.pb-6(column, align-center)
      v-avatar(size='120', color='primary')
        v-img(:src='chat.cover')
      .font-weight-bold.mt-4 {{ chat.title }}
      .font-weight-light {{ chat.member.length }} miembros
    .px-4
      .overline DESCRIPCIÓN
      p {{ chat.description }}
    //- .overline UBICACIÓN
    //- static-map(:coordinates="chat.coordinates")
    v-tabs(
      v-model='tab',
      fixed-tabs,
      background-color='transparent',
      style='position: sticky; top: 0; left: 0; right: 0; z-index: 10',
      next-icon='fas fa-chevron-right',
      prev-icon='fas fa-chevron-left'
    )
      v-tab(key='members') Miembros
      v-tab(key='events') Eventos
      v-tab(key='posts') Posts
      v-tab(key='media') Media
    v-tabs-items(v-model='tab')
      v-tab-item(key='members')
        v-list.pa-4(color='white')
          v-list-item(v-if='isAdmin')
            v-list-item-avatar
              v-icon fas fa-plus
            v-list-item-title Nuevo participante
          v-dialog(v-if='isParticipant', v-model='leaveDialogIn')
            template(v-slot:activator='{ on }')
              v-list-item(v-on='on')
                v-list-item-avatar
                  v-icon.red--text fas fa-sign-out-alt
                v-list-item-title.red--text Salir del grupo
            v-card.pa-2
              .overline SALIR DEL GRUPO
              p.text-center ¿De verdad quieres salir del grupo?
              v-layout(justify-space-between)
                v-btn(text, @click='leaveDialogIn = false') Cancelar
                v-btn(color='red', @click='leaveGroup()', dark, depressed) Salir
          v-menu(offset-y, v-for='(member, i) in chat.member', :key='i')
            template(v-slot:activator='{ on }')
              v-list-item(v-on='on')
                v-list-item-avatar(color='primary')
                  v-img(:src='member.profile.profile_picture')
                v-list-item-content
                  v-list-item-title {{ member.profile.username }}
                  v-list-item-subtitle(v-if='member.is_admin') Administrador
            v-card
              v-list
                v-list-item(nuxt, :to='"/" + member.profile.username')
                  v-list-item-avatar 
                    v-img(:src='member.profile.profile_picture')
                  v-list-item-content Ver perfil de {{ member.profile.username }}
                v-dialog(v-model='addAdminDialog')
                  template(v-slot:activator='{ on }')
                    v-list-item(
                      v-on='on',
                      v-if='isAdmin && member.profile.profile_id != user.profile_id && !member.is_admin'
                    )
                      v-list-item-avatar 
                        v-icon(small) fas fa-user-cog
                      v-list-item-content Hacer Administrador
                  v-card.pa-2
                    .overline HACER ADMINISTRADOR
                    v-list-item
                      v-list-item-avatar
                        v-img(:src='member.profile.profile_picture')
                      v-list-item-content {{ member.profile.username }}
                    p.text-center ¿Quieres añadirlo como administrador?
                    v-layout(justify-space-between)
                      v-btn(text, @click='addAdminDialog = false') Cancelar
                      v-btn(
                        color='primary',
                        dark,
                        depressed,
                        @click='addAdmin(member)'
                      ) Hacer Administrador
                v-dialog(v-model='removeAdminDialog')
                  template(v-slot:activator='{ on }')
                    v-list-item(
                      v-on='on',
                      v-if='isAdmin && member.profile.profile_id != user.profile_id && member.is_admin && !member.is_creator'
                    )
                      v-list-item-avatar 
                        v-icon(small) fas fa-user-cog
                      v-list-item-content Eliminar Administrador
                  v-card.pa-2
                    .overline ELIMINAR ADMINISTRADOR
                    v-list-item
                      v-list-item-avatar
                        v-img(:src='member.profile.profile_picture')
                      v-list-item-content {{ member.profile.username }}
                    p.text-center ¿Quieres quitarlo como administrador?
                    v-layout(justify-space-between)
                      v-btn(text, @click='removeAdminDialog = false') Cancelar
                      v-btn(
                        color='primary',
                        dark,
                        depressed,
                        @click='removeAdmin(member)'
                      ) Quitar Administrador
                v-dialog(v-model='removeParticipantDialog')
                  template(v-slot:activator='{ on }')
                    v-list-item(
                      v-on='on',
                      v-if='isAdmin && member.profile.profile_id != user.profile_id && !member.is_creator'
                    )
                      v-list-item-avatar 
                        v-icon.primary--text(small) fas fa-times
                      v-list-item-content.primary--text Sacar del Grupo
                  v-card.pa-2
                    .overline SACAR DEL GRUPO
                    v-list-item
                      v-list-item-avatar
                        v-img(:src='member.profile.profile_picture')
                      v-list-item-content {{ member.profile.username }}
                    p.text-center ¿Quieres expulsarlo del grupo?
                    v-layout(justify-space-between)
                      v-btn(text, @click='removeParticipantDialog = false') Cancelar
                      v-btn(
                        color='red',
                        dark,
                        depressed,
                        @click='removeParticipant(i)'
                      ) Expulsar
      v-tab-item(key='events')
        v-sheet(color='white')
          event.mb-2(v-for='(event, i) in events', :key='i', :event='event')
      v-tab-item(key='posts')
        v-sheet(color='white')
          masonry.pa-2(:cols='2', :gutter='10')
            post.mb-2(
              v-for='(publication, i) in posts',
              :key='i',
              :type='publication.type',
              :content='publication',
              grid
            )
      v-tab-item(key='media')
        v-sheet(color='white')
          v-layout(wrap)
            v-flex(xs4, v-for='(mediaMessage, i) in media', :key='i')
              v-img.grey.lighten-2(:src='mediaMessage.src', aspect-ratio='1')
                template(#placeholder)
                  v-row.fill-height.ma-0(align='center', justify='center')
                    v-progress-circular(indeterminate, color='grey lighten-5')
  v-bottom-sheet(v-model='shareDialog', :inset='$vuetify.breakpoint.mdAndUp')
    share(:group='chat', @back='shareDialog = false')
</template>

<script>
import numberMixin from '@/mixins/number'
import messages from '@/components/chat/messages'
import chatBar from '@/components/chat/chatBar'
import Post from '@/components/map/post'
import Event from '@/components/event/item'
import date from '@/mixins/date'

export default {
  mixins: [numberMixin, date],
  components: {
    messages,
    chatBar,
    Post,
    Event,
    avatarInput: () => import('@/components/avatar-input'),
    share: () => import('@/components/map/share.vue'),
    // staticMap: () => import('@/components/map/staticMap')
  },
  beforeRouteLeave(_, __, next) {
    this.$store.commit('chat/closeChat')
    next()
  },
  beforeRouteUpdate(_, __, next) {
    this.getChat()
    next()
  },
  data() {
    return {
      shareDialog: false,
      addParticipantDialog: false,
      removeParticipantDialog: false,
      addAdminDialog: false,
      removeAdminDialog: false,
      leaveDialogIn: false,
      leaveDialogOut: false,
      chatLoaded: false,
      hasJoined: false,
      groupinfo: false,
      settingsOpened: false,
      tab: 'members',
      events: [],
      posts: [],
      media: [],
    }
  },
  watch: {
    async tab(value) {
      if (value === 1) {
        this.events = await this.$store.dispatch(
          'chat/getGroupEvents',
          this.chat.chat_id
        )
      } else if (value === 2) {
        this.posts = await this.$store.dispatch(
          'chat/getGroupPosts',
          this.chat.chat_id
        )
      } else if (value === 3) {
        this.media = await this.$store.dispatch(
          'chat/getGroupMedia',
          this.chat.chat_id
        )
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    chat() {
      return this.$store.state.chat.chat
    },
    isParticipant() {
      if (this.hasJoined) return true
      return this.$store.getters['chat/isParticipant']
    },
    isAdmin() {
      if (!this.isParticipant) return false
      const index = this.chat.member.findIndex(
        (member) =>
          member.profile_id === this.user.profile_id &&
          (member.is_admin || member.is_creator)
      )
      return index !== -1
    },
    isCreator() {
      if (!this.isParticipant) return false
      const index = this.chat.member.findIndex(
        (member) =>
          member.profile_id === this.user.profile_id && member.is_creator
      )
      return index !== -1
    },
  },
  mounted() {
    this.getChat()
  },
  methods: {
    async getChat() {
      await this.$store.dispatch('chat/getGroup', this.$route.params.group)

      this.chatLoaded = true
    },
    async joinChat() {
      await this.$store.dispatch('chat/joinChat', this.$route.params.group)
      this.hasJoined = true
    },
    openGroup() {
      this.groupinfo = true
    },
    async addAdmin(member) {
      if (
        await this.$store.dispatch('chat/addAdmin', {
          chatId: this.chat.chat_id,
          memberId: member.profile_id,
        })
      ) {
        member.is_admin = true
      }
    },
    async removeAdmin(member) {
      if (
        await this.$store.dispatch('chat/removeAdmin', {
          chatId: this.chat.chat_id,
          memberId: member.profile_id,
        })
      ) {
        member.is_admin = false
      }
    },
    // async addParticipant() {
    //   await this.$store.dispatch('chat/addParticipant', {
    //     chat_id: this.chat.chat_id,
    //     profile_id: member.profile_id,
    //   })
    // },
    async removeParticipant(i) {
      if (
        await this.$store.dispatch('chat/removeParticipant', {
          chat_id: this.chat.chat_id,
          profile_id: this.chat.member[i].profile_id,
        })
      ) {
        delete this.chat.member[i]
      }
    },
    async leaveGroup() {
      await this.$store.dispatch('chat/leaveGroup', this.chat.chat_id)
      this.$router.replace({ path: '/chat' })
    },
    async muteChat() {
      await this.$store.dispatch('chat/muteChat', this.chat.chat_id)
      this.chat.about.muted = true
    },
    async unmuteChat() {
      await this.$store.dispatch('chat/unmuteChat', this.chat.chat_id)
      this.chat.about.muted = false
    },
    async updateCover(img) {
      await this.$store.dispatch('chat/updateCover', {
        chat_id: this.chat.chat_id,
        cover: img,
      })
      this.chat.cover = img
    },
    async updateChat() {
      await this.$store.dispatch('chat/updateChat', {
        chat_id: this.chat.chat_id,
        chat: {
          title: this.chat.title,
          description: this.chat.description,
        },
      })
      this.settingsOpened = false
    },
  },
}
</script>
