export const state = () => ({
  loginOpened: false,
  postCreated: false,
})

export const mutations = {
  setLogin(state, value) {
    state.loginOpened = value
  },

  setPostCreated(state, value) {
    state.postCreated = value
  },

  disableAllWindows(state) {
    state.loginOpened = false
  },
}
