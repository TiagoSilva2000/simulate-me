import { TimeProps } from '../../types'
import { DEFAULT } from '../../constants'
import City from './City'
export default class Time {
  private readonly _initialTime: number
  private readonly _finalTime: number
  private _modifier: number
  private _currentTime: number
  private _unlimited: boolean
  public readonly TIME_PROCESS_LIMIT: number
  private TIME_PROCESS_CURRENT: number

  public constructor(data: TimeProps) {
    this._initialTime = data.initialYear || DEFAULT.time.INITIAL
    this._currentTime =
      data.currentYear || data.initialYear || DEFAULT.time.INITIAL
    this._modifier = data.modifier || DEFAULT.time.MODIFIER
    this._unlimited = data.timeUnlimited || DEFAULT.time.UNLIMITED

    if (data.finalYear) {
      this._finalTime = data.finalYear
    } else {
      if (data.timeUnlimited) {
        this.TIME_PROCESS_LIMIT = 5
        this.TIME_PROCESS_CURRENT = 0
        this._finalTime = 0
      } else {
        this.TIME_PROCESS_LIMIT = -1
        this.TIME_PROCESS_CURRENT = -1
        this._finalTime = data.finalYear || DEFAULT.time.FINAL
      }
    }
  }

  get unlimited(): boolean {
    return this._unlimited
  }

  get initialTime(): number {
    return this._initialTime
  }

  get finalTime(): number {
    return this._finalTime
  }

  get modifier(): number {
    return this._modifier
  }

  get currentTime(): number {
    return this._currentTime
  }

  public advanceTime(city: City): void {
    this._currentTime += this._modifier
    this.TIME_PROCESS_CURRENT += 1

    for (const c of city.citizens) c.getOlder(this.modifier)
  }

  private timeLimitOver(): boolean {
    return this.TIME_PROCESS_CURRENT >= this.TIME_PROCESS_LIMIT
  }

  public isNotOver(): boolean {
    if (this._unlimited) {
      return !this.timeLimitOver()
    }
    return this._currentTime < this._finalTime
  }
}
