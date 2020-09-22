/* eslint-disable no-array-constructor */
import { Person } from '../person/Person'
import Pos from '../Pos'
import CityMap from './CityMap'

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
      super(sizeX || 10, sizeY || 10)
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
        this._map[i].push(false)
      }
    }
  }

  public populate(citizens: Person[]): void {
    for (const c of citizens) this._map[c.pos.x][c.pos.y] = true
  }

  public getAvailableRandomPosition(): Pos {
    let x: number
    let y: number
    do {
      x = Math.floor(Math.random() * Math.floor(this.sizeX))
      y = Math.floor(Math.random() * Math.floor(this.sizeY))
    } while (this._map[x][y] === true)

    this._map[x][y] = true
    return new Pos(x, y)
  }

  public clearPosition(pos: Pos): boolean {
    if (pos.x < 0 || pos.x >= this._sizeX || pos.y < 0 || pos.y >= this._sizeY)
      return false
    if (this._map[pos.x][pos.y] === false) return false // if already empty

    this._map[pos.x][pos.y] = false

    return true
  }

  public queryMovement(oldp: Pos, newp: Pos): boolean {
    if (
      newp.x < 0 ||
      newp.x >= this._sizeX ||
      newp.y < 0 ||
      newp.y >= this._sizeY
    )
      return false
    if (this._map[newp.x][newp.y] === true) return false

    this._map[newp.x][newp.y] = true
    this._map[oldp.x][oldp.y] = false

    return true
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

  public toString(): string {
    return 'arraymap'
  }
}
