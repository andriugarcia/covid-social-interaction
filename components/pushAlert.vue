<template lang="pug">
v-alert.pointer(
  v-if='pushAvailable && !pushEnabled',
  color='primary',
  dark,
  text,
  icon='fas fa-bell',
  @click='enablePushNotifications'
) Activa las notificaciones para recibir mensajes
</template>

<script>
import pushNotificationMixin from '@/mixins/push'
export default {
  mixins: [pushNotificationMixin],
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