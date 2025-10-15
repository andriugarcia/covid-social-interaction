export const state = () => ({
  loginOpened: false, // Keep for compatibility but always false in demo mode
  postCreated: false,
  shareCreated: false,

  appNotInstalled: false,
  deferredPrompt: null,
})

export const mutations = {
  setLogin(state, value) {
    // In demo mode, never open login
    state.loginOpened = false
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
    // Demo mode - simulate app download
    state.appNotInstalled = false
  },
}
