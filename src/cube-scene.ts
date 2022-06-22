import { circularSystem, playSounds } from './circularSystem'
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

let myEntity = createCube(8, 2, 8)


// addSystem without engine is a helper in this scene
addSystem(circularSystem, { t: 0 })

engine.addSystem(timeOutUpdate)

dcl.onUpdate((dt: number) => {
  engine.update(dt)
})


engine.baseComponents.AudioSource.create(myEntity, {audioClipUrl:"sounds/pickUp.mp3", loop: false, pitch:1, playing: false, volume:1 , playedAtTimestamp:1})


addSystem(playSounds, { t: 0 })



// cone


const cone = engine.addEntity(true)

engine.baseComponents.Transform.create(cone, {
  position: { x:3, y:1, z:3 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: 0, y: 0, z: 0, w: 1 }
})

engine.baseComponents.CylinderShape.create(cone, {
  withCollisions: true,
  isPointerBlocker: true,
  visible: true,
  radiusTop: 0,
  radiusBottom: 1
})


// NFT

const nft = engine.addEntity(true)

engine.baseComponents.Transform.create(nft, {
  position: { x:12, y:1, z:12 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: 0, y: 0, z: 0, w: 1 }
})

engine.baseComponents.NFTShape.create(nft, {
  withCollisions: true,
  isPointerBlocker: true,
  visible: true,
  assetId: '',
  color: { r: 1, g: 1, b: 1 },
  style: 4,
  src:  'ethereum://0x06012c8cf97bead5deae237070f9587f8e7a266d/229795'
})


// 3d model

const zombie = engine.addEntity(true)

engine.baseComponents.Transform.create(zombie, {
  position: { x:12, y:1, z:3 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: 0, y: 0, z: 0, w: 1 }
})

engine.baseComponents.GLTFShape.create(zombie, {
  withCollisions: true,
  isPointerBlocker: true,
  visible: true,
  src:  'models/zombie.glb'
})
