import Disease from './Disease'
import { Status } from '../../../constants'
import { Person } from '../../person/Person'

export default class SecondDayDisease extends Disease {
  public canBeImmune(p: Person): boolean {
    return p.status === Status.HEALTHY && p.age >= 3 && p.age <= 8
  }

  public willDie(p: Person): boolean {
    if (p.infectionAge === undefined) return false

    return p.age - p.infectionAge >= 2
  }

  public contaminate(p: Person): Status {
    p.status = Status.INFECTED
    p.infectionAge = p.age + 1
    return p.status
  }

  public canBeContaminated(p: Person): boolean {
    return p.status === Status.HEALTHY
  }

  public canContaminate(p: Person): boolean {
    return p.status === Status.INFECTED
  }
}
