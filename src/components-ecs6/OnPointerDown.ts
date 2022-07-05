import { ecs7EnsureEntity, ecs7EnsureMutable } from '../ecs7/ECS7'
import { ECS6State } from '../types'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const component = ecs7EnsureMutable(state, engine.baseComponents.OnPointerDown, ecs6EntityId)
  dcl.log({ payload })
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  engine.baseComponents.OnPointerDown.deleteFrom(ecs7EnsureEntity(state, ecs6EntityId))
}
