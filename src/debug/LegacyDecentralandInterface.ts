export namespace LegacyECS {
  function logDclCall(...args: any[]) {
    dcl.log(...args)
  }

  // ECS6 core
  function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {
    logDclCall('updateEntityComponent', { entityId, componentName, classId, json })
    dcl.updateEntityComponent(entityId, componentName, classId, json)
  }

  function attachEntityComponent(entityId: string, componentName: string, id: string): void {
    logDclCall('attachEntityComponent', { entityId, componentName, id })
    dcl.attachEntityComponent(entityId, componentName, id)
  }

  function removeEntityComponent(entityId: string, componentName: string): void {
    logDclCall('removeEntityComponent', { entityId, componentName })
    dcl.removeEntityComponent(entityId, componentName)
  }

  function setParent(entityId: string, parentId: string): void {
    logDclCall('setParent', { entityId, parentId })
    dcl.setParent(entityId, parentId)
  }

  function addEntity(entityId: EntityID): void {
    logDclCall('addEntity', { entityId })
    dcl.addEntity(entityId)
  }

  function removeEntity(entityId: EntityID): void {
    logDclCall('removeEntity', { entityId })
    dcl.removeEntity(entityId)
  }

  function componentCreated(id: string, componentName: string, classId: number) {
    logDclCall('componentCreated', { id, componentName, classId })
    dcl.componentCreated(id, componentName, classId)
  }

  function componentDisposed(id: string) {
    logDclCall('componentDisposed', { id })
    dcl.componentDisposed(id)
  }

  function componentUpdated(id: string, json: string) {
    logDclCall('componentUpdated', { id, json })
    dcl.componentUpdated(id, json)
  }

  // Actions

  function openExternalUrl(url: string) {
    logDclCall('openExternalUrl', { url })
    dcl.openExternalUrl(url)
  }
  function openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null) {
    logDclCall('openNFTDialog', { assetContractAddress, tokenId, comment })
    dcl.openNFTDialog(assetContractAddress, tokenId, comment)
  }

  // Callbacks

  function onUpdate(cb: (deltaTime: number) => void): void {
    logDclCall('onUpdate', { cb })
    dcl.onUpdate(cb)
  }

  function onEvent(cb: (event: any) => void): void {
    logDclCall('onEvent', { cb })
    dcl.onEvent(cb)
  }

  function onStart(cb: () => void) {
    logDclCall('onStart', { cb })
    dcl.onStart(cb)
  }

  // Logging

  function error(message: string, data: Error) {
    logDclCall('error', { message, data })
    dcl.error(message, data)
  }

  function log(...args: any[]) {
    logDclCall('log', { ...args })
    dcl.log(...args)
  }

  // RPC

  async function loadModule(moduleName: string) {
    logDclCall('loadModule', { moduleName })
    return dcl.loadModule(moduleName, {})
  }
  async function callRpc(rpcHandle: string, methodName: string, args: any[]) {
    logDclCall('callRpc', { rpcHandle, methodName, args })
    return dcl.callRpc(rpcHandle, methodName, args)
  }

  // Events
  function query(queryType: any, payload: any) {
    logDclCall('query', { queryType, payload })
    dcl.query(queryType, payload)
  }

  function subscribe(eventName: string): void {
    logDclCall('subscribe', { eventName })
    dcl.subscribe(eventName as any)
  }

  function unsubscribe(eventName: string): void {
    logDclCall('unsubscribe', { eventName })
    dcl.unsubscribe(eventName as any)
  }

  export async function getPatchedDecentralandInterface(): Promise<DecentralandInterface> {
    return {
      DEBUG: true,
      updateEntityComponent,
      attachEntityComponent,
      removeEntityComponent,
      setParent,
      addEntity,
      removeEntity,
      query,
      subscribe,
      unsubscribe,
      componentCreated,
      componentDisposed,
      componentUpdated,
      log,
      openExternalUrl,
      openNFTDialog,
      onUpdate,
      onEvent,
      loadModule,
      callRpc,
      onStart,
      error
    }
  }
}
