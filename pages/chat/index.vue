<template lang="pug">
v-sheet#contacts(
  v-if='!newGroup && !newChat',
  style='height: 100vh; position: relative',
  color='white'
)
  v-toolbar.px-2(
    v-if='!searchEnabled',
    color='primary',
    absolute,
    extended,
    flat,
    dark,
    style='left: 0; right: 0'
  )
    v-btn(icon, small, @click='$router.replace({ path: "/" })')
      v-icon fas fa-arrow-left
    v-toolbar-title Mensajes
    v-spacer
    v-btn(icon, @click='enableSearch')
      v-icon fas fa-search
    template(#extension)
      v-tabs(v-model='tab', fixed-tabs, background-color='transparent')
        v-tab(key='chats') 
          div Chats
          v-chip.primary--text.ml-2(v-show='total != 0', small, color='white') {{ total }}
        v-tab(key='close') 
          div Cerca
          v-chip.primary--text.ml-2(
            v-show='totalClose != 0',
            small,
            color='white'
          ) {{ totalClose }}
  v-toolbar(
    v-else,
    color='primary',
    flat,
    absolute,
    dark,
    style='left: 0; right: 0'
  )
    v-text-field(
      prepend-icon='fas fa-times',
      placeholder='Buscar',
      hide-details,
      v-model='textFilter',
      @click:prepend='disableSearch'
    )
  v-sheet(
    color='white',
    style='overflow-y: scroll; height: 100vh',
    :class='{ "pt-16": searchEnabled, "pt-17": !searchEnabled }'
  )
    push-alert
    v-tabs-items(
      v-model='tab',
      style='background-color: transparent; min-height: calc(100vh - 104px)'
    )
      v-tab-item(key='chats')
        v-list(color='white')
          v-layout.mb-4(v-if='!searchEnabled', justify-center)
            v-card(
              width='120px',
              outlined,
              color='white',
              @click='newGroup = true'
            )
              v-layout(column, align-center)
                v-avatar(color='primary')
                  v-icon(dark, small) fas fa-user-friends
                .mt-2.font-weight-bold(style='font-size: 0.7em') Nuevo Grupo
            v-card(
              width='120px',
              outlined,
              color='white',
              @click='newChat = true'
            )
              v-layout(column, align-center)
                v-avatar(color='primary')
                  v-icon(dark, small) fas fa-user
                .mt-2.font-weight-bold(style='font-size: 0.7em') Nuevo Chat
            v-card(
              v-if='userPosition',
              width='120px',
              outlined,
              color='white',
              @click='$router.push({ path: "/nearby" })'
            )
              v-layout(column, align-center)
                v-badge(
                  overlap,
                  :value='nearbyTotal > 0',
                  :content='nearbyTotal'
                )
                  v-avatar(color='primary')
                    v-icon(dark, small) fas fa-street-view
                .mt-2.font-weight-bold(style='font-size: 0.7em') Gente Cerca
          v-list-item(
            v-for='(chat, i) in chats',
            :key='i',
            @click='openChat(chat)'
          )
            //- v-list-item-avatar(color='primary')
            v-badge.mr-4(
              overlap,
              top,
              color='primary',
              :value='chat.type == "chat" && getMember(chat).active',
              offset-x='18',
              offset-y='18'
            )
              v-avatar(color='primary', :size='42')
                v-img(
                  :src='chat.chat.cover || getMember(chat).profile_picture'
                )
                  template(#placeholder)
                    v-row.fill-height.ma-0(align='center', justify='center')
                      v-progress-circular(indeterminate, color='primary')
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
          div(v-if='searchEnabled && groupsSearched.length > 0')
            v-subheader GRUPOS
            v-list-item(
              v-for='(chat, i) in groupsSearched',
              :key='i',
              @click='joinChat(chat)'
            )
              v-list-item-avatar
                v-img(:src='chat.cover')
                  template(#placeholder)
                    v-row.fill-height.ma-0(align='center', justify='center')
                      v-progress-circular(
                        indeterminate,
                        color='grey lighten-5'
                      )
              v-list-item-content
                v-list-item-title.font-weight-bold {{ chat.title }}
                v-list-item-subtitle a {{ haversineDistance([userPosition.lat, userPosition.lng], [chat.coordinates.lat, chat.coordinates.lng]) }}km, {{ chat.members }} miembros
      v-tab-item(key='close', style='height: 100%')
        v-card.ma-2.rounded-xl(v-if='!userPosition', outlined)
          v-layout.pa-6.text-center(
            column,
            justify-center,
            align-center,
            color='white',
            style='height: 100%'
          )
            v-badge(color='error', bottom, overlap, icon='fas fa-exclamation')
              v-icon(color='grey lighten-1', x-large) fas fa-map-marker-alt
            .mt-4.black--text La geolocalización está desactivada
            .black--text Activa la geolocalización para poder ver los grupos cerca
        v-list(v-else, color='white')
          v-list-item(@click='$router.push({ path: "/nearby" })')
            v-list-item-avatar
              v-icon(color='primary') fas fa-street-view
            v-list-item-content
              v-list-item-title.font-weight-bold Cerca de ti
            v-list-item-action
              v-chip(color='primary') {{ nearbyTotal }}
          v-list-item(
            v-for='(chat, i) in closeChats',
            :key='i',
            @click='joinChat(chat)'
          )
            v-list-item-avatar
              v-img(:src='chat.cover')
                template(#placeholder)
                  v-row.fill-height.ma-0(align='center', justify='center')
                    v-progress-circular(indeterminate, color='primary')
            v-list-item-content
              v-list-item-title.font-weight-bold {{ chat.title }}
              v-list-item-subtitle a {{ haversineDistance([userPosition.lat, userPosition.lng], [chat.coordinates.lat, chat.coordinates.lng]) }}km, {{ chat.members }} miembros
            v-list-item-action
              //- v-chip(v-if="chat.unread != 0", color="primary") {{ chat.unread }}
create-group(v-else-if='newGroup', @back='newGroup = false')
create-chat(v-else, @back='newChat = false')
</template>

<script>
import geo from '@/mixins/geo'
import date from '@/mixins/date'
import pushAlert from '@/components/pushAlert'

export default {
  head: {
    title: 'Chats | Olimaps',
  },
  components: {
    createGroup: () => import('@/layouts/createGroup'),
    createChat: () => import('@/layouts/createChat'),
    pushAlert,
  },
  mixins: [geo, date],
  data() {
    return {
      dial: false,
      newGroup: false,
      newChat: false,
      tab: 'chat',
      searchEnabled: false,
      textFilter: '',
      groupsSearched: [],
      searchingGroups: false,
    }
  },
  watch: {
    async textFilter(value) {
      if (!this.userPosition || this.searchingGroups) return
      this.searchingGroups = true
      this.groupsSearched = await this.$store.dispatch(
        'chat/searchGroups',
        value
      )
      this.searchingGroups = false
    },
  },
  computed: {
    chats() {
      if (!this.$store.getters['auth/authenticated'])
        this.$router.replace({ path: '/' })
      return this.$store.state.chat.chats
        .filter((chat) =>
          (chat.chat.title || this.getMember(chat).username)
            .toLowerCase()
            .includes(this.textFilter.toLowerCase())
        )
        .sort((a, b) => {
          const timeA =
            typeof a.chat.message_chatTomessage_channel[0] !== 'undefined'
              ? a.chat.message_chatTomessage_channel[0].created_at
              : a.chat.created_at
          const timeB =
            typeof b.chat.message_chatTomessage_channel[0] !== 'undefined'
              ? b.chat.message_chatTomessage_channel[0].created_at
              : b.chat.created_at
          const dateA = new Date(timeA)
          const dateB = new Date(timeB)
          return dateA.getTime() > dateB.getTime() ? -1 : 1
        })
    },
    nearbyTotal() {
      return this.$store.state.chat.nearbyTotal
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
      } else if (typeof chat.member[1] !== 'undefined') {
        return chat.member[1].profile
      } else {
        return {
          username: 'Usuario eliminado',
          profile_picture: null,
        }
      }
    },
    getLastMessage(chat) {
      let messageStr = ''
      if (chat.type !== 'chat') {
        messageStr +=
          chat.message_chatTomessage_channel[0].profile.username + ': '
      }
      const emptyMessage =
        chat.message_chatTomessage_channel[0].text !== null &&
        chat.message_chatTomessage_channel[0].text.length !== 0
      if (chat.message_chatTomessage_channel[0].type === 'video') {
        messageStr += emptyMessage
          ? chat.message_chatTomessage_channel[0].text
          : 'Video'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'image') {
        messageStr += emptyMessage
          ? chat.message_chatTomessage_channel[0].text
          : 'Image'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'audio') {
        messageStr += emptyMessage
          ? chat.message_chatTomessage_channel[0].text
          : 'Audio'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'post') {
        messageStr += emptyMessage
          ? chat.message_chatTomessage_channel[0].text
          : 'Post'
        return messageStr
      } else if (chat.message_chatTomessage_channel[0].type === 'chat') {
        messageStr += emptyMessage
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
    enableSearch() {
      this.searchEnabled = true
      this.tab = 0
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

<style lang="css" scoped>
.pt-16 {
  padding-top: 72px;
}
.pt-17 {
  padding-top: 108px;
}
</style>
