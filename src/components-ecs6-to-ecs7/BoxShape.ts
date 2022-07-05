import { ecs7EnsureEntity, ecs7EnsureMutable } from '../ecs7/ECS7'
import { ECS6State } from '../types'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const box = ecs7EnsureMutable(state, engine.baseComponents.BoxShape, ecs6EntityId)
  box.isPointerBlocker = payload.isPointerBlocker
  box.visible = payload.visible
  box.withCollisions = payload.withCollisions
  box.uvs = payload.uvs || []
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  engine.baseComponents.BoxShape.deleteFrom(ecs7EnsureEntity(state, ecs6EntityId))
}
