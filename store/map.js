export const state = () => ({
  userPosition: { lat: 40.4168, lng: -3.7038 }, // Default to Madrid for demo
  userDirection: null,
  mapPosition: { lat: 40.4168, lng: -3.7038 }, // Default to Madrid
  locationEnabled: true, // Always enabled in demo mode
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
