export const state = () => ({
  userPosition: null,
  userDirection: null,
  mapPosition: { lat: 40, lng: -5 },
  locationEnabled: false,
  zoom: 2,
  eventActions: null,
})

export const mutations = {
  setDefaultPosition(state) {
    state.zoom = 2
    state.mapPosition = { lat: 40, lng: -5 }
  },
  setUserPosition(state, coordinates) {
    state.userPosition = { ...coordinates }
    state.locationEnabled = true
    console.log(coordinates.direction)
    state.userDirection = coordinates.direction
  },
  setMapPosition(state, coordinates) {
    console.trace('set map position')
    state.mapPosition = { ...coordinates }
    state.zoom = 14
  },
  setZoom(state, zoom) {
    state.zoom = zoom
  },
  setEventActions(state, eventActions) {
    state.eventActions = eventActions
  },
  jumpTo(state, coordinates) {
    state.eventActions.jumpTo({
      center: coordinates,
      zoom: 15
    })
  },
  flyTo(state, coordinates) {
    state.eventActions.flyTo({
      center: coordinates,
      zoom: 15,
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
