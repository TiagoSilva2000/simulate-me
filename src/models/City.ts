import { CityNeededData } from 'interfaces'
import { ArrayMap } from './map/ArrayMap'
import CityMap from './map/CityMap'
import { Person } from './person/Person'
import Pos from './Pos'

export default class City {
  private readonly _map: CityMap
  private _citizens: Person[]

  public constructor(data: CityNeededData) {
    this._citizens = data.citizens || []
    this._map = data.map || new ArrayMap(data.sizeX || 10, data.sizeY || 10)
  }

  get citizens(): Person[] {
    return this._citizens
  }

  get map(): CityMap {
    return this._map
  }

  public getCitizen(pos: Pos): Person | null {
    for (const p of this._citizens) {
      if (p.pos.equalsTo(pos)) {
        return p
      }
    }
    return null
  }

  public createCitizen(person: Person): void {
    this._citizens.push(person)
  }

  public deleteCitizen(person: Person): boolean {
    let temp: Person
    for (let c of this._citizens)
      if (c.pos.x === person.pos.x && c.pos.y === person.pos.y) {
        temp = c
        c = this._citizens[this._citizens.length - 1]
        this._citizens[this._citizens.length - 1] = temp
        this._citizens.pop()
        return true
      }
    return false
  }

  public generatePosition(): Pos {
    return this._map.getAvailableRandomPosition()
  }

  public whoIsCloseTo(person: Person): Person[] {
    const closePeople = []
    for (const p of this._citizens) {
      if (p.isCloseTo(person)) closePeople.push(p)
    }

    return closePeople
  }
}
