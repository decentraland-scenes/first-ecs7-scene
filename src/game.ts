import { getGameData } from './getEcs6GameData'
import { customEval } from './sandbox'

async function start() {
  const gamejs = await getGameData()
  if (!gamejs) throw new Error(`Unable to fetch the ecs6 main script file.`)

  const newDcl = await AdaptionLayer.getPatchedDecentralandInterface()

  await customEval(gamejs, { dcl: newDcl })
}

start().catch(dcl.error)
