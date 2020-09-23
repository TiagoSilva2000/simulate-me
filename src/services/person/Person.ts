import Random from '../../helpers/Random'
import City from '../core/City'
import { DEFAULT, Gender, Status } from '../../constants'
import { ClosePeopleCategory, PersonProps } from '../../types'
import Pos from '../core/Pos'
import CityMap from '../map/CityMap'
import Logger from '../utils/Logger'
import DataGenerator from '../utils/DataGenerator'
import Disease from 'services/core/disease/Disease'

export abstract class Person {
  private _name: string
  private _age: number
  private _pos: Pos
  private _status: Status
  private _infectionAge: number | undefined

  public constructor(data: PersonProps) {
    this._name = data.name || Random.genName(this)
    this._age = data.age || Random.genAge()
    this._status = data.status || Status.HEALTHY
    this._infectionAge = undefined
    if (data.city) {
      this._pos = Random.genPos(data.city.map)
    } else if (data.pos) {
      this._pos = new Pos(data.pos.x, data.pos.y)
    } else {
      throw new Error('undefined position')
    }
    if (this._status === Status.INFECTED) this._infectionAge = this._age
  }

  public abstract gender(): Gender

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

  public canCopulate(): boolean {
    return this._age >= 18 && this._age <= 25
  }

  public liveIn(
    city: City,
    dataGen: DataGenerator,
    disease: Disease,
    timeLeap?: number
  ): void {
    this.moveIn(city.map)
    this.getOlder(timeLeap || DEFAULT.time.MODIFIER)
    this.getImmunity(dataGen, disease)
    this.interact(city, city.whoIsCloseTo(this), dataGen, disease)
  }

  protected moveIn(map: CityMap): Pos {
    const nextPos = Random.shuffle(this._pos.closePositions()) as Pos[]
    let i = 0

    while (i < nextPos.length && !map.queryMovement(this._pos, nextPos[i])) i++

    if (i !== nextPos.length) this._pos.moveTo(nextPos[i])

    return this._pos
  }

  protected getOlder(timeLeap: number): void {
    this._age += timeLeap
  }

  public checkHealth(disease: Disease): Status {
    if (this._status === Status.DEAD) return Status.DEAD
    if (this._age === 30) return Status.DEAD
    if (this._infectionAge === undefined) return this._status

    if (disease.willDie(this)) return Status.DEAD

    return Status.INFECTED
  }

  protected getImmunity(dataGen: DataGenerator, disease: Disease): void {
    if (disease.canBeImmune(this)) {
      this._status = Status.IMMUNE
      dataGen.pushLog(Logger.GETIMMUNE(this.name, this.age))
    }
  }

  protected interact(
    _city: City,
    closePeople: ClosePeopleCategory,
    dataGen: DataGenerator,
    disease: Disease
  ): void {
    if (this._status === Status.INFECTED) {
      this.infect(closePeople.canBeInfected, dataGen, disease)
    } else if (this.status === Status.HEALTHY) {
      this.checkInfected(closePeople.canInfect, dataGen, disease)
    }
  }

  protected infect(
    closePeople: Person[],
    dataGen: DataGenerator,
    disease: Disease
  ): void {
    for (const p of closePeople) {
      if (disease.canBeContaminated(p)) {
        dataGen.pushLog(Logger.INFECT(this.name, this.pos, p.name, p.pos))
        disease.contaminate(p)
        p._infectionAge = p._age
      }
    }
  }

  protected checkInfected(
    closePeople: Person[],
    dataGen: DataGenerator,
    disease: Disease
  ): void {
    for (const p of closePeople) {
      if (disease.canContaminate(p)) {
        dataGen.pushLog(Logger.GETINFECTED(p.name, p.pos, this.name, this.pos))
        disease.contaminate(this)
        this._infectionAge = this.age
        break
      }
    }
  }
}
