import { ECS6State } from '../types'

export function ecs7ExistsEntity(state: ECS6State, ecs6EntityId: EntityID): boolean {
  if (state.entities[ecs6EntityId] === undefined) {
    return false
  }
  return true
}

export function ecs7EnsureEntity(state: ECS6State, ecs6EntityId: EntityID): Entity {
  if (state.entities[ecs6EntityId] === undefined) {
    state.entities[ecs6EntityId] = engine.addEntity(true)
  }
  return state.entities[ecs6EntityId]
}

export function ecs7EnsureMutable<T extends EcsType<any>>(
  state: ECS6State,
  component: ComponentDefinition<T>,
  ecs6EntityId: EntityID
): ComponentType<T> {
  const entity = ecs7EnsureEntity(state, ecs6EntityId)
  if (component.getOrNull(entity)) {
    return component.mutable(entity)
  } else {
    return component.createOrReplace(entity)
  }
}
