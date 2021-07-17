<template lang="pug">
#activity(style='height: 100%')
  v-toolbar(color='primary', dark)
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    span.font-weight-black Actividad
  v-list(color='white', style='height: 100%')
    push-alert
    v-list-item.px-6(
      v-for='(notification, i) in notifications',
      :key='i',
      nuxt,
      :to='notification.link'
    )
      v-icon.mr-4(color='primary') {{ getIcon(notification.type) }}
      v-avatar(size='40')
        v-img(:src='notification.image') 
      .ml-2.mt-2.text--text.font-weight-bold
        span {{ notification.title }}
        p {{ notification.text }}
</template>

<script>
import iconNotificationMixin from '@/mixins/iconNotification'
import pushAlert from '@/components/pushAlert'
export default {
  mixins: [iconNotificationMixin],
  components: {
    pushAlert,
  },
  mounted() {
    this.$store.dispatch('user/readNotifications')
  },
  computed: {
    notifications() {
      return this.$store.state.auth.user.notifications
    },
  },
}
</script>
