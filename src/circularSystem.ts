export type CircularSystemState = {
  t: number
}

// My system
export function circularSystem(dt: number, state: CircularSystemState, engine: IEngine) {
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



// My system
export function playSounds(dt: number, state: CircularSystemState, engine: IEngine) {
	state.t += dt

	if(state.t < 2){
		return
	}

	state.t = 0
  
	const entitiesWSound = engine.mutableGroupOf(engine.baseComponents.AudioSource)
	for (const [entity, audioSource] of entitiesWSound) {

		audioSource.volume = 10
		audioSource.playedAtTimestamp = Date.now()
		audioSource.pitch = 1//Math.random()*100
		audioSource.playing = true
		
	
  }
}
  