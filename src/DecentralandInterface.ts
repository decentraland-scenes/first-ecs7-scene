import {
  proxyAddEntity,
  proxyAttachEntityComponent,
  proxyComponentCreated,
  proxyComponentDisposed,
  proxyComponentUpdated,
  proxyHandleTick,
  proxyRemoveEntity,
  proxyRemoveEntityComponent,
  proxySetParent,
  proxyUpdateEntityComponent
} from './ecs6/ProxyEcs6'
import { ECS6State } from './types'

export namespace AdaptionLayer {
  const state: ECS6State = {
    onUpdateFunctions: [],
    onStartFunctions: [],
    onEventFunctions: [],
    subscribedEvents: new Set<string>(),

    entities: {},
    components: {}
  } as any

  // ECS6 core
  function attachEntityComponent(entityId: string, componentName: string, id: string): void {
    proxyAttachEntityComponent(state, entityId, componentName, id)
  }

  function removeEntityComponent(entityId: string, componentName: string): void {
    proxyRemoveEntityComponent(state, entityId, componentName)
  }

  function addEntity(entityId: EntityID): void {
    proxyAddEntity(state, entityId)
  }

  function setParent(entityId: string, parentId: string): void {
    proxySetParent(state, entityId, parentId)
  }

  function removeEntity(entityId: EntityID): void {
    proxyRemoveEntity(state, entityId)
  }

  function componentCreated(id: string, componentName: string, classId: number) {
    proxyComponentCreated(state, id, componentName, classId)
  }

  function componentDisposed(id: string) {
    proxyComponentDisposed(state, id)
  }

  function componentUpdated(id: string, json: string) {
    proxyComponentUpdated(state, id, json)
  }

  function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {
    proxyUpdateEntityComponent(state, entityId, componentName, classId, json)
  }

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

    proxyHandleTick()
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
