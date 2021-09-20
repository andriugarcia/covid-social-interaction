<template lang="pug">
#pushAlert(v-if='pushAvailable && !pushEnabled')
  v-alert.pointer(
    v-if='inline',
    color='primary',
    dark,
    text,
    icon='fas fa-bell',
    @click='enablePushNotifications'
  ) 
    v-row(align='center')
      v-col.grow
        span Activa las notificaciones para recibir mensajes
      v-col.shrink
        v-btn.ml-2(small, depressed, color='primary') Activar
  v-card.pa-6.text-center.pointer.rounded-xl(
    v-else,
    color='primary lighten-5',
    outlined,
    @click='enablePushNotifications'
  )
    v-scale-transition
      v-icon(color='primary', size='64') fas fa-bell
    .mt-4 Activa las notificaciones para avisarte de los mensajes
    v-btn.ml-2.mt-4(depressed, color='primary') Activar
</template>

<script>
import pushNotificationMixin from '@/mixins/push'
export default {
  mixins: [pushNotificationMixin],
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pushEnabled() {
      return this.$store.state.auth.pushEnabled
    },
    pushAvailable() {
      return this.$store.state.auth.pushAvailable
    },
  },
}
</script>