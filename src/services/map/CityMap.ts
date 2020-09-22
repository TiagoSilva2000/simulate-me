/* eslint-disable no-useless-constructor */
import { Person } from '../person/Person'
import Pos from '../core/Pos'

export default abstract class CityMap {
  protected constructor(
    protected readonly _sizeX: number,
    protected readonly _sizeY: number
  ) {}

  protected abstract buildMap(): void
  public abstract populate(citizens: Person[]): void
  public abstract queryMovement(oldp: Pos, newp: Pos): boolean
  public abstract getAvailableRandomPosition(): Pos
  public abstract clear(pos: Pos): boolean
  public abstract printInConsole(): void
  public abstract toString(): string
  public abstract has(p: Pos): boolean
  public abstract isFilled(p: Pos): boolean
  public abstract isEmpty(p: Pos): boolean
  protected abstract stateOf(p: Pos): boolean
  get sizeX(): number {
    return this._sizeX
  }

  get sizeY(): number {
    return this._sizeY
  }
}
