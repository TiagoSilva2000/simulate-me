import parse from 'csv-parse/lib/sync'
import fs from 'fs'
import path from 'path'
import City from './City'
import Time from './Time'
import {
  Stats,
  SimulationNeededData,
  PopulationNeededData,
  PersonNeededData
} from '../interfaces'
import Woman from './person/Woman'
import Man from './person/Man'
import { Gender, Status } from '../constants'
import { Person } from './person/Person'
import { ArrayMap } from './map/ArrayMap'
import Pos from './Pos'
import CityMap from './map/CityMap'
import { SimulationData } from '../types'

function getArrayInfo(populationFilePath: string): string[] {
  const content = parse(
    fs.readFileSync(populationFilePath, { encoding: 'utf-8' }),
    {
      delimiter: ';'
    }
  )[0]

  return content
}

function generateRandomPopulationNumbers(initialPopulation: number): number[] {
  const popNumbers: number[] = []

  for (let i = 0; i < initialPopulation; i++) {
    popNumbers.push(Math.floor(Math.random() * 2))
  }

  return popNumbers
}

export class Logger {
  public static LOGS: string[] = []

  public static START(): void {
    this.LOGS.push('Nothing Yet')
  }

  public static NOTHING(): void {
    this.LOGS.push('Nothing Happened')
  }

  public static CLEAR(): void {
    this.LOGS = []
  }

  public static CREATED(name: string, age: number, pos: Pos): void {
    this.LOGS.push(
      `${name}(${age}) WAS magically CREATED at (${pos.x}, ${pos.y})`
    )
  }

  public static INFECT(
    agentName: string,
    p1: Pos,
    pacientName: string,
    p2: Pos
  ): void {
    this.LOGS.push(
      `${agentName}(${p1.x}, ${p1.y}) INFECTED ${pacientName}(${p2.x}, ${p2.y})`
    )
  }

  public static GETINFECTED(
    agentName: string,
    p1: Pos,
    pacientName: string,
    p2: Pos
  ): void {
    this.LOGS.push(
      `${pacientName}(${p1.x}, ${p1.y}) WAS INFECTED by ${agentName}(${p2.x}, ${p2.y})`
    )
  }

  public static DIE(name: string, pos: Pos, age: number): void {
    this.LOGS.push(`${name}(${age}) DIED at (${pos.x}, ${pos.y})`)
  }

  public static BORN(babyName: string, pos: Pos, mothersName: string): void {
    this.LOGS.push(
      `${babyName} BORNED at (${pos.x}, ${pos.y}) FROM ${mothersName}`
    )
  }

  public static GETIMMUNE(name: string, age: number): void {
    this.LOGS.push(`${name}(${age}) BECAME IMMUNE`)
  }
}

export default class Simulation {
  private readonly _city: City
  private readonly _time: Time
  private readonly _stats: Stats
  private readonly _includeCitizens: boolean

  public constructor(data: SimulationNeededData) {
    this._city = data.city || new City({})
    this._time = data.time || new Time({})
    this._includeCitizens = data.includeCitizens || false
    this.populate(data.popData)

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

  get map(): CityMap {
    return this._city.map
  }

  get time(): Time {
    return this._time
  }

  get stats(): Stats {
    return this._stats
  }

  public run(logs?: boolean): SimulationData[] {
    if (logs) Logger.START()

    const simulationHistory: SimulationData[] = []
    let tempData: SimulationData = this.generateData(logs)

    Logger.CLEAR()
    simulationHistory.push(tempData)
    while (this._time.isNotOver()) {
      tempData = this.runStep(logs)
      simulationHistory.push(tempData)
      Logger.CLEAR()
    }

    return simulationHistory
  }

  private runStep(logs?: boolean): SimulationData {
    this.movePeople()
    this.fillStats()

    this._time.advanceTime()
    return this.generateData(logs)
  }

  private movePeople(): void {
    let currStatus: Status

    for (const c of this._city.citizens) {
      if (c.status === Status.DEAD) continue
      c.move(this._city.map)
      c.interact(this._city)
      currStatus = c.checkHealth()
      if (currStatus === Status.DEAD) {
        c.status = Status.DEAD
        Logger.DIE(c.name, c.pos, c.age)
        const flag = this.killPerson(c)
        if (flag === false)
          throw new Error('ERROR WHILE DELETING AN EXISTING CITIZEN')
      }
    }
  }

  private generateData(logs?: boolean): SimulationData {
    const data: SimulationData = {
      year: this._time.currentTime,
      stats: Object.assign({}, this._stats),
      map: [],
      citizens: [],
      logs: []
    }
    const map: Status[][] = []
    let status: Status | undefined

    if (this._city.map instanceof ArrayMap) {
      for (let i = 0; i < this._city.map.map.length; i++) {
        map.push([])
        for (let j = 0; j < this._city.map.map[i].length; j++) {
          if (!this._city.map.map[i][j]) {
            status = Status.EMPTY
          } else {
            const citizen = this._city.getCitizen(new Pos(i, j))
            if (citizen) {
              status = citizen.status
              if (this._includeCitizens) {
                data.citizens.push({
                  name: citizen.name,
                  age: citizen.age,
                  infectionAge: citizen.infectionAge,
                  pos: {
                    x: citizen.pos.x,
                    y: citizen.pos.y
                  },
                  status: citizen.status
                })
              }
            } else {
              status = Status.ERROR
            }
          }

          map[i].push(status)
        }
      }
    }
    data.map = map
    if (logs) {
      if (Logger.LOGS.length === 0) {
        Logger.NOTHING()
      }
      data.logs = Logger.LOGS
    }
    return data
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

  private populate(data: PopulationNeededData): void {
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
      const arrayInfo: string[] = getArrayInfo(
        path.resolve(__dirname, '..', '..', 'public', 'docs', 'first.csv')
      )
      this.populateByDefault(arrayInfo)
    }
  }

  private populateByPersonInfo(data: PersonNeededData[]) {
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
    const popNumbers: number[] = generateRandomPopulationNumbers(maxPopulation)
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
    return this._city.map.clearPosition(person.pos)
  }
}
