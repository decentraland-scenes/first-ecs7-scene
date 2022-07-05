import { ecs7DeleteComponent, ecs7UpdateComponent } from '../ecs7/bridge'
import { ecs7EnsureEntity, ecs7EnsureMutable } from '../ecs7/ECS7'
import { ECS6State } from '../types'

function ensureEcs6ComponentState(state: ECS6State, id: string) {
  if (state.components[id] === undefined) {
    state.components[id] = {}
  }
  return state.components[id]
}

// ECS6 core
export function proxyAttachEntityComponent(
  state: ECS6State,
  entityId: string,
  componentName: string,
  id: string
): void {
  
}

export function proxyRemoveEntityComponent(state: ECS6State, entityId: string, componentName: string): void {
  for (const [_id, component] of Object.entries(state.components)) {
    if (component.entityId === entityId && component.componentName === componentName && component.classId) {
      ecs7DeleteComponent(state, entityId, component.classId)
      return
    }
  }
}

export function proxyAddEntity(state: ECS6State, entityId: EntityID): void {
  if (state.entities[entityId]) {
    engine.removeEntity(state.entities[entityId])
  }
  ecs7EnsureEntity(state, entityId)
}

export function proxySetParent(state: ECS6State, entityId: string, parentId: string): void {
  if (parentId === '0') return
  const parentEntity = ecs7EnsureEntity(state, parentId)
  const transform = ecs7EnsureMutable(state, engine.baseComponents.Transform, entityId)
  transform.parent = parentEntity
}

export function proxyRemoveEntity(state: ECS6State, entityId: EntityID): void {
  if (state.entities[entityId] === undefined) {
    return
  }
  engine.removeEntity(state.entities[entityId])
  delete state.entities[entityId]
}

export function proxyComponentCreated(state: ECS6State, id: string, componentName: string, classId: number) {
  state.components[id] = {
    classId,
    componentName
  }
}

export function proxyComponentDisposed(state: ECS6State, id: string) {
  if (state.components[id]) {
    const component = state.components[id]
    if (component.entityId && component.classId) {
      ecs7DeleteComponent(state, component.entityId, component.classId)
    }
    delete state.components[id]
  }
}

export function proxyComponentUpdated(state: ECS6State, id: string, json: string) {
  ensureEcs6ComponentState(state, id)
  const component = state.components[id]
  component.data = JSON.parse(json)
  if (component.classId && component.entityId) {
    ecs7UpdateComponent(state, component.entityId, component.classId, component.data)
  }
}

export function proxyUpdateEntityComponent(
  state: ECS6State,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  const payload = JSON.parse(json)
  ecs7UpdateComponent(state, entityId, classId, payload)
}

export function proxyHandleTick() {}

/**
 *   
  - function attachEntityComponent(entityId: string, componentName: string, id: string): void
  function removeEntityComponent(entityId: string, componentName: string): void
  - function addEntity(entityId: EntityID): void
  - function setParent(entityId: string, parentId: string): void
  function removeEntity(entityId: EntityID): void
  -  function componentCreated(id: string, componentName: string, classId: number)
  function componentDisposed(id: string)
  - function componentUpdated(id: string, json: string)
  - function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void

# Cube scene example
componentCreated(id: 'Ce', componentName: 'engine.shape', classId: 16)
componentUpdated(id: 'Ce', json: '{"withCollisions": true, ....}')
addEntity(entityId: 'Ed')
updateEntityComponent(entityId: 'Ed', componentName: 'engine.transform', classId: 1, json:'{"position": {"x":1 , ....')
attachEntityComponent(entityId: 'Ed', componentName: 'engine.shape', id: 'Ce')

 */
