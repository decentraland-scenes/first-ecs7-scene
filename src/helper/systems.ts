export function addSystem<T>(fn: (dt: number, state: T, engine: IEngine) => void, initialState: T, engine: IEngine) {
  const state = { ...initialState }
  engine.addSystem((dt: number) => fn(dt, state, engine))
}
