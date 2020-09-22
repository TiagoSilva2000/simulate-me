/* eslint-disable no-array-constructor */
import { Person } from '../person/Person'
import Pos from '../core/Pos'
import CityMap from './CityMap'
import { DEFAULT } from '../../constants'

const PosState = {
  EMPTY: false,
  FILLED: true
}

export class ArrayMap extends CityMap {
  private _map: Array<Array<boolean>>

  public constructor(
    sizeX?: number,
    sizeY?: number,
    buildedMap?: Array<Array<boolean>>
  ) {
    if (buildedMap) {
      super(buildedMap.length, buildedMap[0].length)
    } else {
      super(sizeX || DEFAULT.map_size.X, sizeY || DEFAULT.map_size.Y)
    }
    this.buildMap(buildedMap)
  }

  get map(): Array<Array<boolean>> {
    return this._map
  }

  protected buildMap(buildedMap?: Array<Array<boolean>>): void {
    if (buildedMap) {
      this._map = buildedMap
      return
    }

    this._map = []

    for (let i = 0; i < this._sizeX; i++) {
      this._map.push([])
      for (let j = 0; j < this._sizeY; j++) {
        this._map[i].push(PosState.EMPTY)
      }
    }
  }

  public has(p: Pos): boolean {
    return p.x >= 0 && p.x < this._sizeX && p.y >= 0 && p.y < this._sizeY
  }

  protected stateOf(p: Pos): boolean {
    if (!this.has(p)) {
      throw new Error('position out of range')
    }
    return this._map[p.x][p.y]
  }

  public isFilled(p: Pos): boolean {
    return this.stateOf(p)
  }

  public isEmpty(p: Pos): boolean {
    return this.stateOf(p)
  }

  public toString(): string {
    return 'arraymap'
  }

  public printInConsole(): void {
    for (const i in this._map) {
      for (const j in this._map[i]) {
        process.stdout.write(`|${Number(this._map[i][j])}| `)
      }
      process.stdout.write('\n')
    }
    console.log('')
  }

  public populate(citizens: Person[]): void {
    for (const c of citizens) this._map[c.pos.x][c.pos.y] = PosState.FILLED
  }

  public getAvailableRandomPosition(): Pos {
    let x: number
    let y: number
    do {
      x = Math.floor(Math.random() * Math.floor(this.sizeX))
      y = Math.floor(Math.random() * Math.floor(this.sizeY))
    } while (this._map[x][y] === PosState.FILLED)

    this._map[x][y] = PosState.FILLED
    return new Pos(x, y)
  }

  public clear(pos: Pos): boolean {
    if (!this.has(pos)) return false
    if (this._map[pos.x][pos.y] === PosState.EMPTY) {
      throw new Error('error while trying to clear a position already empty')
    }

    this._map[pos.x][pos.y] = PosState.EMPTY

    return true
  }

  public queryMovement(oldp: Pos, newp: Pos): boolean {
    if (!this.has(newp)) return false
    if (this._map[newp.x][newp.y] === PosState.FILLED) return false

    this._map[newp.x][newp.y] = PosState.FILLED
    this._map[oldp.x][oldp.y] = PosState.EMPTY

    return true
  }
}
