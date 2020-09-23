import { Status } from '../../../constants'
import { Person } from '../../person/Person'

export default abstract class Disease {
  public abstract canBeImmune(p: Person): boolean
  public abstract willDie(p: Person): boolean
  public abstract contaminate(p: Person): Status
  public abstract canBeContaminated(p: Person): boolean
  public abstract canContaminate(p: Person): boolean
}
