<template lang="pug">
#contacts(v-if='!newGroup', style='height: 100%; position: relative')
  v-card(flat, color='primary', tile, dark)
    v-toolbar.px-2(v-if='!searchEnabled', color='primary', extended)
      v-btn(icon, small, @click='$router.go(-1)')
        v-icon fas fa-arrow-left
      v-toolbar-title Mensajes
      v-spacer
      v-btn(icon, @click='searchEnabled = true')
        v-icon fas fa-search
      template(#extension)
        v-tabs(v-model='tab', fixed-tabs)
          v-tab(key='chats') 
            div Chats
            v-chip.primary--text.ml-2(
              v-show='total != 0',
              small,
              color='white'
            ) {{ total }}
          v-tab(key='close') 
            div Grupos Cerca
            v-chip.primary--text.ml-2(
              v-show='totalClose != 0',
              small,
              color='white'
            ) {{ totalClose }}
    v-toolbar(v-else, color='primary')
      v-text-field(
        prepend-icon='fas fa-arrow-left',
        placeholder='Buscar',
        hide-details,
        v-model='textFilter',
        @click:prepend='disableSearch'
      )
    v-tabs-items(v-model='tab')
      v-tab-item(key='chats')
        v-list
          v-list-item(
            v-for='(chat, i) in chats',
            :key='i',
            @click='openChat(chat)'
          )
            v-list-item-avatar
              v-img(:src='chat.chat.cover || getMember(chat).profile_picture')
            v-list-item-content
              v-list-item-title.font-weight-bold {{ chat.chat.title || getMember(chat).username }}
              v-list-item-subtitle.text-truncate(
                v-if='chat.chat.message_chatTomessage_channel.length != 0',
                :class='{ "font-weight-bold": chat.unread != 0 }',
                style='max-width: 260px',
                v-html='getLastMessage(chat.chat)'
              )
            v-list-item-action
              span(
                v-if='chat.chat.message_chatTomessage_channel.length != 0',
                style='font-size: 0.8em'
              ) {{ chat.chat.message_chatTomessage_channel[0].created_at | toRelativeDate }}
              v-chip(v-if='chat.unread != 0', color='primary') {{ chat.unread }}
      v-tab-item(key='close')
        v-layout.pa-6.text-center(
          v-if='!userPosition',
          column,
          justify-center,
          align-center,
          style='height: 100%'
        )
          v-icon(color='primary', x-large) fas fa-map-marker-alt
          .mt-4.black--text La geolocalización está desactivada
          .black--text Activa la geolocalización para poder ver los grupos cerca
        v-list(v-else)
          v-list-item
            v-list-item-avatar
              v-icon(color='primary') fas fa-street-view
            v-list-item-content
              v-list-item-title.font-weight-bold Cerca de ti
            v-list-item-action
              v-chip(color='primary') 15
          v-list-item(
            v-for='(chat, i) in closeChats',
            :key='i',
            @click='joinChat(chat)'
          )
            v-list-item-avatar
              v-img(:src='chat.cover')
            v-list-item-content
              v-list-item-title.font-weight-bold {{ chat.title }}
              v-list-item-subtitle a {{ haversineDistance([userPosition.lat, userPosition.lng], [chat.coordinates.lat, chat.coordinates.lng]) }}km, {{ chat.members }} miembros
            v-list-item-action
              //- v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
  v-speed-dial(v-model='dial', absolute, bottom, right)
    template(#activator)
      v-btn(fab, color='primary', dark)
        v-icon {{ dial ? "fas fa-times" : "fas fa-pen" }}
    v-btn(fab, @click='newGroup = true')
      v-icon fas fa-user-friends
create-group(v-else, @back='newGroup = false')
</template>

<script>
import geo from '@/mixins/geo'
import date from '@/mixins/date'

export default {
  components: {
    createGroup: () => import('@/layouts/createGroup'),
  },
  mixins: [geo, date],
  data() {
    return {
      dial: false,
      newGroup: false,
      tab: 'chat',
      searchEnabled: false,
      textFilter: '',
    }
  },
  computed: {
    chats() {
      if (!this.$store.getters['auth/authenticated'])
        this.$router.replace({ path: '/' })
      return this.$store.state.chat.chats.filter((chat) =>
        (chat.chat.title || this.getMember(chat).username)
          .toLowerCase()
          .includes(this.textFilter.toLowerCase())
      )
    },
    closeChats() {
      return this.$store.state.chat.closeChats
    },
    total() {
      return this.$store.getters['chat/total']
    },
    totalClose() {
      return this.$store.getters['chat/totalClose']
    },
    userPosition() {
      return this.$store.state.map.userPosition
    },
  },
  methods: {
    getMember({ chat }) {
      if (
        chat.member[0].profile.profile_id !==
        this.$store.state.auth.user.profile_id
      ) {
        return chat.member[0].profile
      } else {
        return chat.member[1].profile
      }
    },
    getLastMessage(chat) {
      let messageStr = ''
      if (chat.type !== 'chat') {
        messageStr +=
          chat.message_chatTomessage_channel[0].profile.username + ': '
      }
      if (chat.message_chatTomessage_channel[0].type === 'video') {
        messageStr +=
          chat.message_chatTomessage_channel[0].text.length !== 0
            ? chat.message_chatTomessage_channel[0].text
            : 'Video'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'image') {
        messageStr +=
          chat.message_chatTomessage_channel[0].text.length !== 0
            ? chat.message_chatTomessage_channel[0].text
            : 'Image'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'audio') {
        messageStr +=
          chat.message_chatTomessage_channel[0].text.length !== 0
            ? chat.message_chatTomessage_channel[0].text
            : 'Audio'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'post') {
        messageStr +=
          chat.message_chatTomessage_channel[0].text.length !== 0
            ? chat.message_chatTomessage_channel[0].text
            : 'Post'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'chat') {
        messageStr +=
          chat.message_chatTomessage_channel[0].text.length !== 0
            ? chat.message_chatTomessage_channel[0].text
            : 'Chat'
        return messageStr
      }
      messageStr += chat.message_chatTomessage_channel[0].text
      return messageStr
    },
    disableSearch() {
      this.textFilter = ''
      this.searchEnabled = false
    },
    openChat({ chat }) {
      if (typeof chat.type !== 'undefined' && chat.type === 'group') {
        this.$router.push({ path: `/group/${chat.chat_id}` })
      } else {
        this.$router.push({ path: `/chat/${chat.chat_id}` })
      }
    },
    joinChat(chat) {
      this.$router.push({ path: `/group/${chat.chat_id}` })
    },
  },
}
</script>
