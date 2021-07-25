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
    console.log('%cIniciando mapa', 'color: blue;')
    state.eventActions = eventActions
  },
  jumpTo(state, coordinates) {
    if (!state.eventActions) return
    console.log('%cSalto', 'color: blue;')
    state.eventActions.jumpTo({
      center: coordinates,
      zoom: 15
    })
  },
  flyTo(state, coordinates) {
    if (!state.eventActions) return
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
