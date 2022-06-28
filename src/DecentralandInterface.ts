export namespace AdaptionLayer {
  type ECS6State = {
    onUpdateFunctions: ((dt: number) => void)[]
    onStartFunctions: (() => void)[]
    onEventFunctions: ((event: any) => void)[]
    subscribedEvents: Set<string>
  }

  const state: ECS6State = {
    onUpdateFunctions: [],
    onStartFunctions: [],
    onEventFunctions: [],
    subscribedEvents: new Set<string>()
  }

  // ECS6 core
  function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {}
  function attachEntityComponent(entityId: string, componentName: string, id: string): void {}
  function removeEntityComponent(entityId: string, componentName: string): void {}
  function setParent(entityId: string, parentId: string): void {}
  function addEntity(entityId: EntityID): void {}
  function removeEntity(entityId: EntityID): void {}
  function componentCreated(id: string, componentName: string, classId: number) {}
  function componentDisposed(id: string) {}
  function componentUpdated(id: string, json: string) {}

  // Actions
  function openExternalUrl(url: string) {}
  function openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null) {}

  // Events
  function query(queryType: any, payload: any) {}
  function subscribe(eventName: string): void {
    state.subscribedEvents.add(eventName)
  }
  function unsubscribe(eventName: string): void {
    state.subscribedEvents.delete(eventName)
  }

  // Callbacks
  function onUpdate(cb: (deltaTime: number) => void): void {
    state.onUpdateFunctions.push(cb)
  }
  function onEvent(cb: (event: any) => void): void {
    state.onUpdateFunctions.push(cb)
  }
  function onStart(cb: () => void) {
    state.onEventFunctions.push(cb)
  }

  // Logging
  function error(message: string, data: Error) {
    dcl.error(message, data)
  }
  function log(...args: any[]) {
    dcl.log(...args)
  }

  // RPC
  async function loadModule(moduleName: string) {
    return dcl.loadModule(moduleName, undefined)
  }
  async function callRpc(rpcHandle: string, methodName: string, args: any[]) {
    return dcl.callRpc(rpcHandle, methodName, args)
  }

  function onLegacyUpdate(dt: number) {
    for (const cb of state.onUpdateFunctions) {
      try {
        cb(dt)
      } catch (err: any) {
        error('Error onLegacyUpdate', err)
      }
    }
  }

  export async function getPatchedDecentralandInterface(): Promise<DecentralandInterface> {
    engine.addSystem(onLegacyUpdate)

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
