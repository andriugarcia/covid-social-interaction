
export default {
  methods: {
    checkIfNotificationsEnabled() {
      if ('Notification' in window) {
        this.$store.commit('auth/setPushAvailable', true)

        let enabled = false
        if (Notification.permission === "granted") {

          const token = localStorage.getItem(`pushToken-${this.$store.state.auth.user.profile_id}`)
          enabled = token ? true : false

        }
        this.$store.commit('auth/setPushEnabled', enabled)
      } else {
        this.$store.commit('auth/setPushAvailable', false)
      }
    },

    async enablePushNotifications() {
      if (!this.$store.getters['auth/authenticated']) return false

      try {
        Notification.requestPermission(async (result) => {
          if (result === 'denied') {

            return;
          } else if (result === 'default') {

            return;
          } else {
            const currentToken = await this.$fire.messaging.getToken()

            if (currentToken) {
              this.$store.dispatch('user/sendNotificationToken', currentToken)
              localStorage.setItem(`pushToken-${this.$store.state.auth.user.profile_id}`, currentToken)
              this.$fire.analytics.logEvent('push_notification_enabled')
            } else {
              console.warn('No se ha podido registrar el token de notification')
            }
          }
        });
      } catch (err) {
        console.error(err)
      }

      // this.$fire.messaging.onMessage((payload) => {
      //   console.info('Message received: ', payload)
      // })
      this.$store.commit('auth/setPushEnabled', true)
      return true
    },
  }
}