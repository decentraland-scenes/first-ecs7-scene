import { getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { getParcel } from '@decentraland/ParcelIdentity'

export async function getGameData(): Promise<string | undefined> {
  try {
    const [parcelData, realm] = await Promise.all([getParcel(), getCurrentRealm()])
    const contents: any[] = (parcelData.land as any).mappingsResponse?.contents
    const file = contents.find((item) => item.file === 'ecs6/game.data')!
    const url = realm?.domain + '/content/contents/' + file.hash
    const ecs6js = await fetch(url)
    const data = await ecs6js.text()
    return data
  } catch (err: any) {
    dcl.error(err)
  }
}
