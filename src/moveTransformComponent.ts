import { EcsInterpolation, Interpolate, InterpolationType } from "./helper/interpolation"



const Vector3EcsType = MapType({
	x: Float32, 
	y: Float32, 
	z: Float32
 })


const MoveTransportData = MapType({
	hasFinished: EcsBoolean,
	duration: Float32,
	start: Vector3EcsType,
	end: Vector3EcsType,
	normalizedTime: Float32,
	lerpTime: Float32,
	speed: Float32,
	interpolationType: Float32,// EcsInterpolation,
	// onFinishCallback?: () => void	
})

const MoveTransformComponent = engine.defineComponent(46, MoveTransportData)
	



function moveSystem(dt: number) {
    for (const [entity, move] of engine.mutableGroupOf(MoveTransformComponent)) {

	//update
	// move.normalizedTime =  Scalar.Clamp(
	// 	move.normalizedTime + dt * move.speed,
	// 	0,
	// 	1
	//   )

	  move.normalizedTime = Math.min( Math.max( move.normalizedTime + dt * move.speed ,0),1) 


	  move.lerpTime = Interpolate(move.interpolationType, move.normalizedTime)

	  // assign value to transform
	  engine.baseComponents.Transform.mutable(entity).position = Vector3.lerp(move.start, move.end, move.lerpTime)

 		// has finished
 		move.hasFinished = move.normalizedTime >= 1

	  if(move.hasFinished){
		 //move.onFinishCallback()
		MoveTransformComponent.deleteFrom(entity)
	  }
    }
}


// function moveHasFinished(): boolean {
// 	return this.normalizedTime >= 1
//   }



 

//  /**
// 	* Create a MoveTransformComponent instance to add as a component to a Entity
// 	* @param start - starting position
// 	* @param end - ending position
// 	* @param duration - duration (in seconds) of start to end translation
// 	* @param onFinishCallback - called when translation ends
// 	* @param interpolationType - type of interpolation to be used (default: LINEAR)
// 	*/
// 	create(
// 		start: ReadOnlyVector3,
// 		end: ReadOnlyVector3,
// 		duration: number,
// 		onFinishCallback?: () => void,
// 		interpolationType: InterpolationType = InterpolationType.LINEAR
// 	  ) {
// 		this.start = start
// 		this.end = end
// 		this.normalizedTime = 0
// 		this.lerpTime = 0
// 		this.onFinishCallback = onFinishCallback
// 		this.interpolationType = interpolationType
	
// 		if (duration != 0) {
// 		  this.speed = 1 / duration
// 		} else {
// 		  this.speed = 0
// 		  this.normalizedTime = 1
// 		  this.lerpTime = 1
// 		}
	
// 		let instance = TransformSystem.createAndAddToEngine()
// 		instance.addComponentType(MoveTransformComponent)
// 	  }
//   });


engine.addSystem(moveSystem)


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



MoveTransformComponent.create(zombie,{
	start: { x:12, y:1, z:3 },
	end: { x:12, y:1, z:13 },
	duration: 10,
	normalizedTime: 0,
	lerpTime: 0,
	speed: 0.02,
	hasFinished: false,
	interpolationType: 15,

})