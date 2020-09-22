import { TimeProps } from '../../types'
import { DEFAULT } from '../../constants'
export default class Time {
  private readonly _initialTime: number
  private readonly _finalTime: number
  private _modifier: number
  private _currentTime: number
  private _unlimited: boolean
  public readonly TIME_PROCESS_LIMIT: number

  public constructor(data: TimeProps) {
    this._initialTime = data.initialYear || DEFAULT.time.INITIAL
    this._currentTime = data.currentYear || DEFAULT.time.INITIAL
    this._modifier = data.modifier || DEFAULT.time.MODIFIER
    this._unlimited = data.timeUnlimited || DEFAULT.time.UNLIMITED

    if (data.finalYear) {
      this._finalTime = data.finalYear
    } else {
      if (data.timeUnlimited) {
        this.TIME_PROCESS_LIMIT = 5
        this._finalTime = 0
      } else {
        this.TIME_PROCESS_LIMIT = -1
        this._finalTime = data.finalYear || DEFAULT.time.FINAL
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

  private timeLimitOver(): boolean {
    return this._currentTime - this._initialTime >= this.TIME_PROCESS_LIMIT
  }

  public isNotOver(): boolean {
    return (
      (this._unlimited && !this.timeLimitOver()) ||
      this._currentTime < this._finalTime
    )
  }
}
