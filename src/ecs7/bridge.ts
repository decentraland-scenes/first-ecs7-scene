import { ComponentAdaptation, ECS6State, ECS6_CLASS_ID } from '../types'

import * as Ecs6Transform from '../components-ecs6-to-ecs7/Transform'
import * as Ecs6BoxShape from '../components-ecs6-to-ecs7/BoxShape'
import * as Ecs6OnPointerDown from '../components-ecs6-to-ecs7/OnPointerDown'

const componentUpdates: Map<ECS6_CLASS_ID, ComponentAdaptation> = new Map([
  [ECS6_CLASS_ID.TRANSFORM, Ecs6Transform],
  [ECS6_CLASS_ID.BOX_SHAPE, Ecs6BoxShape],
  [ECS6_CLASS_ID.UUID_CALLBACK, Ecs6OnPointerDown]
])

export function ecs7DeleteComponent(state: ECS6State, ecs6EntityId: EntityID, ecs6ClassId: number): void {
  const deleteFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.remove
  if (deleteFn) {
    deleteFn(state, ecs6EntityId)
  }
}

export function ecs7UpdateComponent(state: ECS6State, ecs6EntityId: EntityID, ecs6ClassId: number, payload: any): void {
  const updateFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn) {
    updateFn(state, ecs6EntityId, payload)
  }
}
