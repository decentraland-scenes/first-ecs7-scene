export type CircularSystemState = {
  t: number
}

// My system
export function circularSystem(dt: number, state: CircularSystemState) {
  state.t += 2 * Math.PI * dt

  const entitiesWithBoxShapes = engine.groupOf(engine.baseComponents.BoxShape)
  for (const [entity] of entitiesWithBoxShapes) {
    const transform = engine.baseComponents.Transform.mutable(entity)
    if (transform) {
      transform.position.x = 8 + 2 * Math.cos(state.t)
      transform.position.z = 8 + 2 * Math.sin(state.t)
    }
  }
}
