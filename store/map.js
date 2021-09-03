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
  fitBounds(state, bbox) {
    if (!state.eventActions) return
    state.eventActions.fitBounds([
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ], {
      speed: 2
    })
  },
  jumpTo(state, coordinates) {
    if (!state.eventActions) return

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
