// Demo mode - mock socket for portfolio app
const mockSocket = {
  emit: () => {},
  on: () => {},
  disconnect: () => {},
  connected: false
}

export default mockSocket