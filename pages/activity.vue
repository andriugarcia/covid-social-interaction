<template lang="pug">
#activity(style='height: 100vh; position: relative')
  v-toolbar(color='primary', dark, flat, absolute, style='left: 0; right: 0')
    v-btn(icon, @click='$router.go(-1)')
      v-icon fas fa-arrow-left
    v-toolbar-title Actividad
  v-list.pt-15(color='white', style='height: 100vh; overflow-y: scroll')
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
      .ml-2.mt-2(style='width: 100%')
        v-layout(justify-space-between, align-center)
          span.text--text.font-weight-bold {{ notification.title }}
          span(style='font-size: 0.8em') {{ notification.created_at | toRelativeDate }}
        p {{ notification.text }}
</template>

<script>
import iconNotificationMixin from '@/mixins/iconNotification'
import pushAlert from '@/components/pushAlert'
import date from '@/mixins/date'

export default {
  mixins: [iconNotificationMixin, date],
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
