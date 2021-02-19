export const state = () => ({
  loginOpened: false,
})

export const mutations = {
  setLogin(state, value) {
    state.loginOpened = value
  },

  disableAllWindows(state) {
    state.loginOpened = false
  },
}
