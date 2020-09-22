/* eslint-disable no-useless-constructor */
import { Person } from '../person/Person'
import Pos from '../Pos'

export default abstract class CityMap {
  protected constructor(
    protected readonly _sizeX: number,
    protected readonly _sizeY: number
  ) {}

  protected abstract buildMap(): void
  public abstract populate(citizens: Person[]): void
  public abstract queryMovement(oldp: Pos, newp: Pos): boolean
  public abstract getAvailableRandomPosition(): Pos
  public abstract clearPosition(pos: Pos): boolean
  public abstract printInConsole(): void
  public abstract toString(): string
  get sizeX(): number {
    return this._sizeX
  }

  get sizeY(): number {
    return this._sizeY
  }
}
