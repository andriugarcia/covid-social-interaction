export const state = () => ({
  loginOpened: false,
  postCreated: false,
  shareCreated: false,
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
}
