import { ecs7DeleteComponent, ecs7UpdateComponent } from './ecs7/bridge'
import { ecs7EnsureEntity, ecs7EnsureMutable } from './ecs7/ECS7'
import { ECS6State } from './types'

export namespace AdaptionLayer {
  const state: ECS6State = {
    onUpdateFunctions: [],
    onStartFunctions: [],
    onEventFunctions: [],
    subscribedEvents: new Set<string>(),

    entities: {},
    components: {}
  }

  function ensureEcs6ComponentState(id: string) {
    if (state.components[id] === undefined) {
      state.components[id] = {}
    }
    return state.components[id]
  }

  // ECS6 core
  function attachEntityComponent(entityId: string, componentName: string, id: string): void {
    const component = ensureEcs6ComponentState(id)
    component.entityId = entityId
    component.componentName = componentName
    if (component.classId && component.data) {
      ecs7UpdateComponent(state, component.entityId, component.classId, component.data)
    }
  }

  function removeEntityComponent(entityId: string, componentName: string): void {
    for (const [_id, component] of Object.entries(state.components)) {
      if (component.entityId === entityId && component.componentName === componentName && component.classId) {
        ecs7DeleteComponent(state, entityId, component.classId)
        return
      }
    }
  }

  function addEntity(entityId: EntityID): void {
    if (state.entities[entityId]) {
      engine.removeEntity(state.entities[entityId])
    }
    ecs7EnsureEntity(state, entityId)
  }

  function setParent(entityId: string, parentId: string): void {
    if (parentId === '0') return
    const parentEntity = ecs7EnsureEntity(state, parentId)
    const transform = ecs7EnsureMutable(state, engine.baseComponents.Transform, entityId)
    transform.parent = parentEntity
  }

  function removeEntity(entityId: EntityID): void {
    if (state.entities[entityId] === undefined) {
      return
    }
    engine.removeEntity(state.entities[entityId])
    delete state.entities[entityId]
  }

  function componentCreated(id: string, componentName: string, classId: number) {
    state.components[id] = {
      classId,
      componentName
    }
  }

  function componentDisposed(id: string) {
    if (state.components[id]) {
      const component = state.components[id]
      if (component.entityId && component.classId) {
        ecs7DeleteComponent(state, component.entityId, component.classId)
      }
      delete state.components[id]
    }
  }

  function componentUpdated(id: string, json: string) {
    ensureEcs6ComponentState(id)
    const component = state.components[id]
    component.data = JSON.parse(json)
    if (component.classId && component.entityId) {
      ecs7UpdateComponent(state, component.entityId, component.classId, component.data)
    }
  }

  function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {
    const payload = JSON.parse(json)
    ecs7UpdateComponent(state, entityId, classId, payload)
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
