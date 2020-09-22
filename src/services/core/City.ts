import Man from '../../services/person/Man'
import { Status } from '../../constants'
import { CityProps, ClosePeopleCategory } from '../../types'
import { ArrayMap } from '../map/ArrayMap'
import CityMap from '../map/CityMap'
import { Person } from '../person/Person'
import Pos from './Pos'

export default class City {
  private readonly _map: CityMap
  private _citizens: Person[]

  public constructor(data: CityProps) {
    this._citizens = data.citizens || []
    this._map = data.map || new ArrayMap(data.sizeX, data.sizeY)
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
    throw new Error('error while trying to get citizen by position')
  }

  public createCitizen(person: Person): void {
    this._citizens.push(person)
  }

  public deleteCitizen(pToDelete: Person): boolean {
    let temp: Person
    for (let c of this._citizens)
      if (pToDelete.pos.equalsTo(c.pos)) {
        temp = c
        c = this._citizens[this._citizens.length - 1]
        this._citizens[this._citizens.length - 1] = temp
        this._citizens.pop()
        return true
      }
    throw new Error('error while trying to delete citizen')
  }

  public whoIsCloseTo(person: Person): ClosePeopleCategory {
    const closePeople: ClosePeopleCategory = {
      canBeInfected: [],
      partner: undefined,
      canInfect: []
    }
    for (const p of this._citizens) {
      if (p.isCloseTo(person)) {
        if (p.status === Status.HEALTHY) closePeople.canBeInfected.push(p)
        else if (p.status === Status.INFECTED) closePeople.canInfect.push(p)

        if (!closePeople.partner && p instanceof Man && p.canCopulate()) {
          closePeople.partner = p
        }
      }
    }

    return closePeople
  }
}
