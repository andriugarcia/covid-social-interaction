<template lang="pug">
#newChat(style='position: relative; width: 100%; height: 100vh')
  v-btn(
    fab,
    style='position: absolute; top: 12px; left: 12px',
    light,
    @click='$emit("back")'
  )
    v-icon fas fa-times
  div(style='position: absolute; bottom: 0px; left: 0; right: 0')
    v-card.ma-2.pb-3.rounded-xl(outlined)
      v-layout.mt-4(justify-center)
        v-avatar(size='80', color='primary')
          v-img(:src='user.profile_picture')
      v-layout.px-6.mt-4(align-center, justify-space-between)
        div
          .font-weight-bold.ml-2(style='font-size: 1.2em') {{ user.name }}
          span.ml-1 @{{ user.username }}
        .font-weight-black(v-if='user.followers') {{ user.followers }} seguidores
    v-card.ma-2.pa-3.mt-6.mb-12.rounded-pill(
      color='yellow',
      style='max-width: 60%'
    ) Escribe un mensaje
    chat-bar(:chat='chat', :userId='user.profile_id')
</template>

<script>
import chatBar from '@/components/chat/chatBar'
export default {
  components: {
    chatBar,
  },
  props: ['user'],
}
</script>