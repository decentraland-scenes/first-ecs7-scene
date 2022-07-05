import { AdaptionLayer } from './DecentralandInterface'
import { getGameData } from './getEcs6GameData'
import { LegacyECS } from './LegacyDecentralandInterface'
import { customEval } from './sandbox'

async function start() {
  const gamejs = await getGameData()
  if (!gamejs) throw new Error(`Unable to fetch the ecs6 main script file.`)

  // const newDcl = await AdaptionLayer.getPatchedDecentralandInterface()
  const newDcl = await LegacyECS.getPatchedDecentralandInterface()

  await customEval(gamejs, { dcl: newDcl })
}

start().catch(dcl.error)
