import { TimeNeededData } from '../interfaces'

export default class Time {
  private readonly _initialTime: number
  private readonly _finalTime: number
  private _modifier: number
  private _currentTime: number
  private _timeUnlimited: boolean
  public readonly TIME_PROCESS_LIMIT: number

  public constructor(data: TimeNeededData) {
    this._initialTime = data.initialYear || 0
    this._timeUnlimited = data.timeUnlimited || false
    this._modifier = data.modifier || 1
    this._currentTime = data.currentYear || this._initialTime

    if (data.finalYear) {
      this._finalTime = data.finalYear
    } else {
      if (data.timeUnlimited) {
        this.TIME_PROCESS_LIMIT = 5
        this._finalTime = 0
      } else {
        this.TIME_PROCESS_LIMIT = -1
        this._finalTime = data.finalYear || 32
      }
    }
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

  public advanceTime(): void {
    this._currentTime += this._modifier
  }

  public isNotOver(): boolean {
    if (this._timeUnlimited) {
      if (this._currentTime - this._initialTime < this.TIME_PROCESS_LIMIT)
        return true
    }

    return this._currentTime < this._finalTime
  }
}
