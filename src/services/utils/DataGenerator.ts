import { SimulationData } from '../../types'
import { ArrayMap } from '../map/ArrayMap'
import Logger from './Logger'
import Simulation from '../core/Simulation'
import Pos from '../core/Pos'
import { Status } from '../../constants'

export default class DataGenerator {
  private _data: SimulationData[]
  private _hasLogs: boolean
  private _tempLog: string[] | undefined

  constructor(hasLogs?: boolean) {
    this._data = []
    this._hasLogs = hasLogs || false

    if (hasLogs) {
      this._tempLog = []
      this._tempLog.push(Logger.START())
    } else {
      this._tempLog = undefined
    }
  }

  get hasLogs(): boolean {
    return this._hasLogs
  }

  get data(): SimulationData[] {
    return this._data
  }

  get logs(): string[] | undefined {
    return this._tempLog
  }

  public pushLog(log: string): void {
    if (this._tempLog) this._tempLog.push(log)
  }

  public pushLogs(logs: string[]): void {
    if (!this._tempLog) return
    for (const log of logs) {
      this._tempLog.push(log)
    }
  }

  public generateAndSave(sim: Simulation): void {
    this._data.push(this.generate(sim))
  }

  public generate(sim: Simulation): SimulationData {
    const data: SimulationData = {
      year: sim.time.currentTime,
      stats: Object.assign({}, sim.stats),
      map: [],
      citizens: [],
      logs: []
    }
    const map: Status[][] = []
    let status: Status | undefined

    if (sim.city.map instanceof ArrayMap) {
      for (let i = 0; i < sim.city.map.map.length; i++) {
        map.push([])
        for (let j = 0; j < sim.city.map.map[i].length; j++) {
          if (!sim.city.map.map[i][j]) {
            status = Status.EMPTY
          } else {
            const citizen = sim.city.getCitizen(new Pos(i, j))
            if (citizen) {
              status = citizen.status
              if (sim.includeCitizens) {
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
    if (this._hasLogs && this._tempLog) {
      if (this._tempLog.length === 0) {
        data.logs = [Logger.NOTHING()]
      } else {
        data.logs = this._tempLog
        this._tempLog = []
      }
    }

    return data
  }
}
