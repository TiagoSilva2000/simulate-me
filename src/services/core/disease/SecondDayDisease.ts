import Disease from './Disease'
import { Status } from '../../../constants'
import { Person } from '../../person/Person'

export default class SecondDayDisease extends Disease {
  public canBeImmune(p: Person): boolean {
    return p.status === Status.HEALTHY && p.age >= 3 && p.age <= 8
  }

  public willDie(p: Person): boolean {
    if (!p.infectionAge) return true

    return p.infectionAge - p.age < 3
  }

  public contaminate(p: Person): Status {
    p.status = Status.INFECTED

    return p.status
  }

  public canBeContaminated(p: Person): boolean {
    return p.status === Status.HEALTHY
  }

  public canContaminate(p: Person): boolean {
    return p.status === Status.INFECTED
  }
}
