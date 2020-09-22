import { Status } from './constants'
import City from './services/core/City'
import CityMap from './services/map/CityMap'
import { Person } from './services/person/Person'
import Time from './services/core/Time'

export type Stats = {
  infected: number
  dead: number
  healthy: number
  immune: number
}

export type ClosePeopleCategory = {
  canBeInfected: Person[]
  canInfect: Person[]
  partner: Person | undefined
}

export interface PersonData {
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

export type PopulationDefaultData = {
  healthyWoman: number
  healthyMan: number
  infectedWoman: number
  infectedMan: number
}

export type PersonProps = {
  city?: City
  gender?: number
  infectionAge?: number
  pos?: {
    x: number
    y: number
  }
  name?: string
  age?: number
  status?: Status
}

export type PopulationProps = {
  populationFilePath?: string
  initialPopulation?: number
  populationInfo?: PersonProps[]
  personArray?: Person[]
  defaultPopulation?: PopulationDefaultData
}

export type SimulationProps = {
  city?: City
  time?: Time
  stats?: Stats
  includeCitizens?: boolean
  popData: PopulationProps
  logs?: boolean
}

export type TimeProps = {
  initialYear?: number
  currentYear?: number
  finalYear?: number
  modifier?: number
  timeUnlimited?: boolean
}

export type CityProps = {
  map?: CityMap
  citizens?: Person[]
  sizeX?: number
  sizeY?: number
}
