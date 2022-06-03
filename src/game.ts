import { circularSystem } from './circularSystem'
import { addSystem } from './helper/systems'

// This would be exposed globally as is?
const engine = Engine()

// My cube generator
function createCube(x: number, y: number, z: number) {
  const sdk = engine.baseComponents
  const myEntity = engine.addEntity()

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
addSystem(circularSystem, { t: 0 }, engine)

///###############################################
///###############################################
///###############################################
///###############################################
///###############################################
///###############################################
///###############################################
///###############################################

//  meanwhile a section with old ecs stuffs

import { getUserData } from '@decentraland/Identity'

getUserData()
  .then((value) => dcl.log({ userData: value }))
  .catch((err) => dcl.error(err))
// getUserData()

// dcl
//   .loadModule('Identity', {})
//   .then((value) => dcl.log(value))
//   .catch((err) => dcl.error(err))

dcl.log('asd')
