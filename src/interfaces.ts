import { Status } from './constants'
import City from './models/City'
import CityMap from './models/map/CityMap'
import { Person } from './models/person/Person'
import Time from './models/Time'

export interface Stats {
  infected: number
  dead: number
  healthy: number
  immune: number
}

export interface PersonNeededData {
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

export interface PopulationDefaultData {
  healthyWoman: number
  healthyMan: number
  infectedWoman: number
  infectedMan: number
}

export interface PopulationNeededData {
  populationFilePath?: string
  initialPopulation?: number
  populationInfo?: PersonNeededData[]
  personArray?: Person[]
  defaultPopulation?: PopulationDefaultData
}

export interface SimulationNeededData {
  city?: City
  time?: Time
  stats?: Stats
  includeCitizens?: boolean
  popData: PopulationNeededData
}

export interface TimeNeededData {
  initialYear?: number
  currentYear?: number
  finalYear?: number
  modifier?: number
  timeUnlimited?: boolean
}

export interface CityNeededData {
  map?: CityMap
  citizens?: Person[]
  sizeX?: number
  sizeY?: number
}
