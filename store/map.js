export const state = () => ({
  userPosition: { lng: -3.68984, lat: 40.4086 },
  mapPosition: { lng: -3.68984, lat: 40.4086 },
})

export const mutations = {
  setUserPosition(state, coordinates) {
    state.userPosition = coordinates
  },
  setMapPosition(state, coordinates) {
    state.mapPosition = { ...coordinates }
  },
  flyToMe(state) {
    state.mapPosition = { ...state.userPosition }
  },
}

export const actions = {}
