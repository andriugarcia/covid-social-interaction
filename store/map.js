export const state = () => ({
  userPosition: null,
  mapPosition: null,
  zoom: 15,
  eventActions: null,
})

export const mutations = {
  setUserPosition(state, coordinates) {
    state.userPosition = { ...coordinates }

    if (!state.mapPosition) {
      state.mapPosition = { ...coordinates }
    }
  },
  setMapPosition(state, coordinates) {
    state.mapPosition = { ...coordinates }
  },
  setZoom(state, zoom) {
    state.zoom = zoom
  },
  setEventActions(state, eventActions) {
    state.eventActions = eventActions
  },
  flyToMe(state) {
    state.eventActions.flyTo({
      center: state.userPosition,
      zoom: 15,
      speed: 2,
    })
    // state.mapPosition = { ...state.userPosition }
  },
}

export const actions = {}
