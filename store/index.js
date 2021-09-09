export const state = () => ({
  loginOpened: false,
  postCreated: false,
  shareCreated: false,

  appNotInstalled: false,
  deferredPrompt: null,
})

export const mutations = {
  setLogin(state, value) {
    state.loginOpened = value
  },

  setPostCreated(state, value) {
    state.postCreated = value
  },

  setShareCreated(state, value) {
    state.shareCreated = value
  },

  disableAllWindows(state) {
    state.loginOpened = false
  },

  downloadApp(state) {
    this.app.$fire.analytics.logEvent('install')
    state.deferredPrompt.prompt()
    state.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        state.appNotInstalled = false
      } else {
        state.appNotInstalled = true
      }
    })
  },
}
