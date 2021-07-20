
export default {
  methods: {
    checkIfNotificationsEnabled() {
      this.$store.commit('auth/setPushEnabled', typeof this.$fireMess !== 'undefined')
      console.log("Checking notifications")
      let enabled = false
      if (Notification.permission === "granted") {
        console.log("Granted")
        const token = localStorage.getItem('pushToken')
        enabled = token ? true : false
        console.log(enabled)
      }
      this.$store.commit('auth/setPushEnabled', enabled)
    },

    async enablePushNotifications() {
      if (!this.$store.getters['auth/authenticated']) return false
      console.log('INIT PUSH NOTIFICATIONS')
      try {
        const currentToken = await this.$fire.messaging.getToken()

        if (currentToken) {
          this.$store.dispatch('user/sendNotificationToken', currentToken)
          localStorage.setItem('pushToken', currentToken)
        } else {
          console.warn('No se ha podido registrar el token de notification')
        }
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