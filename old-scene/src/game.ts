/// --- Set up a system ---

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // iterate over the entities of the group
    for (const entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8)

let otherCube: Entity | null = null
let otherCube2: Entity | null = null
let counter = 0

cube.addComponent(
  new OnPointerDown(() => {

    // cube.getComponent(Transform).scale.z *= 1.1
    // cube.getComponent(Transform).scale.x *= 0.9

    counter++
    log({ counter })
    switch (counter) {
      case 1:
      case 3:
      case 6:
        otherCube = spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
        break;

      case 5:
      case 2:
        engine.removeEntity(otherCube!)
        break

      case 4:
        otherCube?.removeComponent(BoxShape)
        break;

      case 7:
        otherCube?.removeComponent(Transform)
        break;

      case 8:

        break;

      default:
        break;
    }

  })
)
