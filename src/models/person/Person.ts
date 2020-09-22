import PersonDataGenerator from '../../services/PersonDataGenerator'
import City from '../City'
import { Status } from '../../constants'
import { PersonNeededData } from '../../interfaces'
import Pos from '../Pos'
import CityMap from '../map/CityMap'
import Woman from './Woman'
import Man from './Man'
import { Logger } from '../Simulation'

export abstract class Person {
  private _name: string
  private _age: number
  private _pos: Pos
  private _status: Status
  private _infectionAge: number | undefined

  public constructor(data: PersonNeededData) {
    this._name = data.name || PersonDataGenerator.randomName()
    this._age = data.age || PersonDataGenerator.randomAge()
    this._status = data.status || Status.HEALTHY
    this._infectionAge = undefined
    if (data.city) {
      this._pos = data.city.generatePosition()
    } else if (data.pos) {
      this._pos = new Pos(data.pos.x, data.pos.y)
    } else {
      throw new Error('undefined position')
    }
    if (this._status === Status.INFECTED) this._infectionAge = this._age
  }

  public abstract genderToString(): string

  get name(): string {
    return this._name
  }

  set name(newName: string) {
    this._name = newName
  }

  get age(): number {
    return this._age
  }

  set age(newAge: number) {
    this._age = newAge
  }

  get infectionAge(): number | undefined {
    return this._infectionAge
  }

  get pos(): Pos {
    return this._pos
  }

  get status(): Status {
    return this._status
  }

  set status(newStatus: Status) {
    this._status = newStatus
  }

  public isCloseTo(person: Person): boolean {
    return this._pos.isClose(person.pos)
  }

  public move(map: CityMap): Pos {
    const nextPos = this._pos.nextPositions()
    let i = 0

    while (i < nextPos.length && !map.queryMovement(this._pos, nextPos[i])) i++

    if (i !== nextPos.length) this._pos.moveTo(nextPos[i])

    return this._pos
  }

  public getOlder(): void {
    this._age += 1
  }

  public checkHealth(): Status {
    if (this._status === Status.DEAD) return Status.DEAD
    if (this._age === 30) return Status.DEAD
    if (this._infectionAge === undefined) return this._status

    if (this._age - this._infectionAge > 2) return Status.DEAD

    return Status.INFECTED
  }

  public getImmunity(): void {
    if (this._status === Status.IMMUNE) return

    if (this._age >= 3 && this._age <= 8 && this._status === Status.HEALTHY) {
      this._status = Status.IMMUNE
      Logger.GETIMMUNE(this.name, this.age)
    }
  }

  public interact(city: City): void {
    const closePeople = city.whoIsCloseTo(this)
    this.getOlder()
    this.getImmunity()

    if (this._status === Status.INFECTED) {
      this.infect(closePeople)
    } else if (this.status === Status.HEALTHY) {
      this.checkInfected(closePeople)
    }
    if (this instanceof Woman && this._age >= 18 && this._age <= 25) {
      for (const p of closePeople)
        if (p instanceof Man && p._age >= 18 && p._age <= 25) {
          city.createCitizen(this.giveBirth(city, p))
          break
        }
    }
  }

  private infect(closePeople: Person[]): void {
    for (const p of closePeople) {
      if (p._status === Status.HEALTHY) {
        Logger.INFECT(this.name, this.pos, p.name, p.pos)
        p.status = Status.INFECTED
        p._infectionAge = p._age
      }
    }
  }

  private checkInfected(closePeople: Person[]): void {
    for (const p of closePeople) {
      if (p.status === Status.INFECTED) {
        Logger.GETINFECTED(p.name, p.pos, this.name, this.pos)
        this._status = Status.INFECTED
        this._infectionAge = this.age
        break
      }
    }
  }
}
