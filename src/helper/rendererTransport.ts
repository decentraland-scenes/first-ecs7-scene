let ExperimentalAPI: any | undefined = undefined
dcl
  .loadModule('@decentraland/ExperimentalAPI', {})
  .then((module) => {
    ExperimentalAPI = module
    dcl.log('Module loaded successfully ExperimentalAPI', module, { module: Object.keys(module) })
  })
  .catch((err) => {
    dcl.error('Module not loaded experimental api ', err)
  })

export function createRendererTransport() {
  return {
    type: 'renderer',
    send(message: Uint8Array): void {
      if (ExperimentalAPI) {
        dcl.callRpc('ExperimentalAPI', 'sendToRenderer', [{ data: message }])
      }
    },
    onmessage(message: Uint8Array): void {},
    filter(message: TransportMessage): boolean {
      // Echo message, ignore them
      if (message.transportType === 'renderer') {
        return false
      }

      return !!message
    }
  }
}
