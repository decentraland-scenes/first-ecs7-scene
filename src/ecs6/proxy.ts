import { adaptToEcs7 } from '../ecs7/adapter'
import { ECS6State, ECS6_CLASS_ID_BYPASS, EventItem } from '../types'

function componentExists(state: ECS6State, id: string): boolean {
  return state.ecs6.componentsWithId[id] !== undefined
}

function entityExists(state: ECS6State, entityId: string): boolean {
  return state.ecs6.entities[entityId] !== undefined
}

function componentNameExistsInEntity(state: ECS6State, entityId: string, componentName: string): boolean {
  if (!entityExists(state, entityId)) {
    return false
  }

  return entityExists(state, entityId) && state.ecs6.entities[entityId].componentsName[componentName] !== undefined
}

function isBypassableClassId(classId: number): boolean {
  return ECS6_CLASS_ID_BYPASS.includes(classId)
}

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 * @param id
 */
export function proxyAttachEntityComponent(
  state: ECS6State,
  entityId: string,
  componentName: string,
  id: string
): void {
  if (componentExists(state, id)) {
    state.ecs6.componentsWithId[id] = {
      componentName,
      classId: 0,
      disposed: false,
      json: '{}'
    }
  }

  if (!entityExists(state, entityId)) {
    state.ecs6.entities[entityId] = {
      componentsName: {}
    }
  }

  state.ecs6.entities[entityId].componentsName[componentName] = { classId: state.ecs6.componentsWithId[id].classId }

  state.ecs6.events.push({
    method: 'attachEntityComponent',
    data: {
      entityId,
      componentName,
      id
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 */
export function proxyRemoveEntityComponent(state: ECS6State, entityId: string, componentName: string): void {
  state.ecs6.events.push({
    method: 'removeEntityComponent',
    data: {
      entityId,
      componentName
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 */
export function proxyAddEntity(state: ECS6State, entityId: EntityID): void {
  state.ecs6.events.push({
    method: 'addEntity',
    data: {
      entityId
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param parentId
 */
export function proxySetParent(state: ECS6State, entityId: string, parentId: string): void {
  state.ecs6.events.push({
    method: 'setParent',
    data: {
      entityId,
      parentId
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 */
export function proxyRemoveEntity(state: ECS6State, entityId: EntityID): void {
  state.ecs6.events.push({
    method: 'removeEntity',
    data: {
      entityId
    }
  })
}

/**
 *
 * @param state
 * @param id
 * @param componentName
 * @param classId
 */
export function proxyComponentCreated(state: ECS6State, id: string, componentName: string, classId: number) {
  state.ecs6.componentsWithId[id] = {
    componentName,
    classId,
    disposed: false,
    json: '{}'
  }

  state.ecs6.events.push({
    method: 'componentCreated',
    data: {
      id,
      componentName,
      classId
    }
  })
}

/**
 *
 * @param state
 * @param id
 */
export function proxyComponentDisposed(state: ECS6State, id: string) {
  state.ecs6.events.push({
    method: 'componentDisposed',
    data: {
      id
    }
  })
}

/**
 *
 * @param state
 * @param id
 * @param json
 */
export function proxyComponentUpdated(state: ECS6State, id: string, json: string) {
  state.ecs6.componentsWithId[id].json = json

  state.ecs6.events.push({
    method: 'componentUpdated',
    data: {
      id,
      json
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 * @param classId
 * @param json
 */
export function proxyUpdateEntityComponent(
  state: ECS6State,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  if (!entityExists(state, entityId)) {
    state.ecs6.entities[entityId] = {
      componentsName: {}
    }
  }

  if (!entityExists(state, entityId)) {
    state.ecs6.entities[entityId] = { componentsName: {} }
  }

  state.ecs6.entities[entityId].componentsName[componentName] = { classId }

  state.ecs6.events.push({
    method: 'updateEntityComponent',
    data: {
      entityId,
      componentName,
      classId,
      json
    }
  })
}

function hasEntityBypassableComponent(state: ECS6State, entityId: string): boolean {
  return false
}

function isEventBypassable(state: ECS6State, event: EventItem): boolean {
  switch (event.method) {
    case 'attachEntityComponent':
      if (isBypassableClassId(state.ecs6.componentsWithId[event.data.id].classId)) {
        return true
      }
      break
    case 'removeEntityComponent':
      if (componentNameExistsInEntity(state, event.data.entityId, event.data.componentName)) {
        if (
          isBypassableClassId(state.ecs6.entities[event.data.entityId].componentsName[event.data.componentName].classId)
        ) {
          return true
        }
      }
      break
    case 'componentCreated':
      if (isBypassableClassId(event.data.classId)) {
        return true
      }
      break
    case 'componentDisposed':
      if (componentExists(state, event.data.id)) {
        if (isBypassableClassId(state.ecs6.componentsWithId[event.data.id].classId)) {
          return true
        }
      }
      break
    case 'componentUpdated':
      if (
        state.ecs6.componentsWithId[event.data.id] &&
        isBypassableClassId(state.ecs6.componentsWithId[event.data.id].classId)
      ) {
        return true
      }

      break
    case 'updateEntityComponent':
      if (isBypassableClassId(event.data.classId)) {
        return true
      }
      break

    case 'addEntity':
    case 'removeEntity':
    case 'setParent':
      // it's the same to write return hasEnt...
      if (hasEntityBypassableComponent(state, event.data.entityId)) {
        return true
      }
      break

    default:
      break
  }

  return false
}

export function proxyHandleTick(state: ECS6State) {
  for (const event of state.ecs6.events) {
    if (isEventBypassable(state, event)) {
      // UNSAFE method call, but event.method and event.data are strongly typed
      ;(dcl as any)[event.method](...Object.values(event.data))
    } else {
      adaptToEcs7(state, event)
    }
  }
}

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

/**
 * 
function attachEntityComponent(entityId: string, componentName: string, id: string): void
function removeEntityComponent(entityId: string, componentName: string): void
function addEntity(entityId: EntityID): void
function setParent(entityId: string, parentId: string): void
function removeEntity(entityId: EntityID): void
function componentCreated(id: string, componentName: string, classId: number)
function componentDisposed(id: string)
function componentUpdated(id: string, json: string)
function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void
 * 
 */
