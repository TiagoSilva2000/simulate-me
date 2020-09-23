import path from 'path'
import 'dotenv/config'

import City from './City'
import Time from './Time'
import {
  Stats,
  SimulationProps,
  PopulationProps,
  PersonProps,
  SimulationData
} from '../../types'
import Logger from '../utils/Logger'
import Woman from '../person/Woman'
import Man from '../person/Man'
import { Gender, Status } from '../../constants'
import { Person } from '../person/Person'
import CityMap from '../map/CityMap'
import { getFileInfo } from '../../helpers/Parser'
import Random from '../../helpers/Random'
import DataGenerator from '../utils/DataGenerator'
import Disease from './disease/Disease'
import SecondDayDisease from './disease/SecondDayDisease'

export default class Simulation {
  private readonly _name: string
  private readonly _city: City
  private readonly _time: Time
  private readonly _stats: Stats
  private readonly _includeCitizens: boolean
  private readonly dataGenerator: DataGenerator
  private readonly _disease: Disease

  public constructor(data: SimulationProps) {
    this._name = data.name
    this._disease = new SecondDayDisease()

    this._city = data.city || new City({})
    this._time = data.time || new Time({})
    this._includeCitizens = data.includeCitizens || true
    this.populate(data.popData)
    this.dataGenerator = new DataGenerator(data.logs)
    if (data.stats) {
      this._stats = data.stats
    } else {
      this._stats = {
        dead: 0,
        healthy: 0,
        immune: 0,
        infected: 0
      }
      this.fillStats()
    }
  }

  get hasLogs(): boolean {
    return this.dataGenerator.hasLogs
  }

  get name(): string {
    return this._name
  }

  get includeCitizens(): boolean {
    return this._includeCitizens
  }

  get city(): City {
    return this._city
  }

  get map(): CityMap {
    return this._city.map
  }

  get time(): Time {
    return this._time
  }

  get stats(): Stats {
    return this._stats
  }

  public run(): SimulationData[] {
    this.dataGenerator.generateAndSave(this)
    while (this._time.isNotOver()) {
      this.runStep()
      this.dataGenerator.generateAndSave(this)
    }

    return this.dataGenerator.data
  }

  private runStep(): void {
    this.movePeople()
    this.fillStats()

    this._time.advanceTime(this._city)
  }

  private movePeople(): void {
    let currStatus: Status

    for (const c of this._city.citizens) {
      if (c.status === Status.DEAD) continue

      c.liveIn(this._city, this.dataGenerator, this._disease)

      currStatus = c.checkHealth(this._disease)
      if (currStatus === Status.DEAD) {
        this.dataGenerator.pushLog(Logger.DIE(c.name, c.pos, c.age))
        this.killPerson(c)
      }
    }
  }

  private fillStats(): void {
    this._stats.dead = 0
    this._stats.infected = 0
    this._stats.healthy = 0
    this._stats.immune = 0
    for (const c of this._city.citizens) {
      if (c.status === Status.DEAD) {
        this._stats.dead++
      } else if (c.status === Status.INFECTED) {
        this.stats.infected++
      } else if (c.status === Status.HEALTHY) {
        this.stats.healthy++
      } else {
        this._stats.immune++
      }
    }
  }

  private populate(data: PopulationProps): void {
    if (data.initialPopulation) {
      this.populateByRandomGenerator(data.initialPopulation)
    } else if (data.personArray) {
      this.populateByPersonArray(data.personArray)
    } else if (data.populationInfo) {
      this.populateByPersonInfo(data.populationInfo)
    } else if (data.defaultPopulation) {
      this.populateByDefault([
        data.defaultPopulation.infectedWoman,
        data.defaultPopulation.healthyWoman,
        data.defaultPopulation.infectedMan,
        data.defaultPopulation.healthyMan
      ])
    } else {
      const arrayInfo: string[] = getFileInfo(
        path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          'docs',
          (process.env.DEFAULT_POPULATION_FILENAME as string) + '.csv'
        )
      )
      this.populateByDefault(arrayInfo)
    }
  }

  private populateByPersonInfo(data: PersonProps[]) {
    for (const info of data) {
      let p: Person
      if (info.gender === Gender.WOMAN) {
        p = new Woman(info)
      } else {
        p = new Man(info)
      }

      this._city.citizens.push(p)
    }
  }

  private populateByDefault(arrayInfo: string[] | number[]): void {
    for (let i = 0; i < Number(arrayInfo[0]); i++) {
      this._city.citizens.push(
        new Woman({ city: this._city, status: Status.INFECTED })
      )
    }

    for (let i = 0; i < Number(arrayInfo[1]); i++)
      this._city.citizens.push(new Woman({ city: this._city }))

    for (let i = 0; i < Number(arrayInfo[2]); i++)
      this._city.citizens.push(
        new Man({ city: this._city, status: Status.INFECTED })
      )

    for (let i = 0; i < Number(arrayInfo[3]); i++)
      this._city.citizens.push(new Man({ city: this._city }))

    this._city.map.populate(this._city.citizens)
  }

  private populateByRandomGenerator(maxPopulation: number): void {
    const popNumbers: number[] = Random.genPopulationSet(maxPopulation)
    for (const personSex of popNumbers) {
      if (personSex === 0)
        this._city.createCitizen(new Woman({ city: this._city }))
      else this._city.createCitizen(new Man({ city: this._city }))
    }
  }

  private populateByPersonArray(citizens: Person[]): void {
    for (const c of citizens) {
      this._city.citizens.push(c)
    }
    this._city.map.populate(this._city.citizens)
  }

  private killPerson(person: Person): boolean {
    const success = this._city.map.clear(person.pos)
    if (!success) throw new Error('ERROR WHILE DELETING AN EXISTING CITIZEN')

    return true
  }
}
