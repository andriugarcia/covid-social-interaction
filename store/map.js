export const state = () => ({
  userPosition: null,
  userDirection: null,
  mapPosition: null,
  locationEnabled: false,
  zoom: 14,
  eventActions: null,
})

export const mutations = {
  setDefaultPosition(state) {
    state.zoom = 2
    state.mapPosition = { lat: 40, lng: -5 }
  },
  setUserPosition(state, coordinates) {
    state.userPosition = { ...coordinates }
    if (!state.mapPosition)
      state.mapPosition = { ...coordinates }
    state.locationEnabled = true
    console.log(coordinates.direction)
    state.userDirection = coordinates.direction
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
  flyTo(state, coordinates) {
    state.eventActions.flyTo({
      center: coordinates,
      zoom: 13,
      speed: 2,
    })
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
