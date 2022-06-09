import { circularSystem } from './circularSystem'
import { timeOutUpdate } from './helper/setTimeout'
import { addSystem } from './helper/systems'

// My cube generator
function createCube(x: number, y: number, z: number) {
  const sdk = engine.baseComponents
  // Dynamic entity because we aren't loading static entities out of this scene code
  const myEntity = engine.addEntity(true)

  sdk.Transform.create(myEntity, {
    position: { x, y, z },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
  })

  sdk.BoxShape.create(myEntity, {
    withCollisions: true,
    isPointerBlocker: true,
    visible: true,
    uvs: []
  })

  return myEntity
}

createCube(8, 2, 8)

// addSystem without engine is a helper in this scene
addSystem(circularSystem, { t: 0 }, engine)

// This is the native addSystem
engine.addSystem(timeOutUpdate)
