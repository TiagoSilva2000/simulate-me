import { Stats } from './interfaces'
import { Status } from './constants'

export type PersonData = {
  name: string
  age: number
  pos: {
    x: number
    y: number
  }
  infectionAge: number | undefined
  status: Status
}

export type SimulationData = {
  map: Status[][]
  year: number
  stats: Stats
  citizens: PersonData[]
  logs: string[]
}

export type SimStateData = SimulationData & {
  citizens: PersonData[]
}
