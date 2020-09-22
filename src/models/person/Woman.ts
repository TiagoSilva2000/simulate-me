import { Logger } from '../Simulation'
import PersonDataGenerator from '../../services/PersonDataGenerator'
import City from '../City'
import Man from './Man'
import { Person } from './Person'

export default class Woman extends Person {
  public giveBirth(city: City, man: Person): Person {
    let baby: Person

    if (man.age > this.age)
      baby = new Man({
        city: city,
        age: 0,
        name: PersonDataGenerator.randomName()
      })
    else
      baby = new Woman({
        city: city,
        age: 0,
        name: PersonDataGenerator.randomName()
      })

    Logger.BORN(baby.name, baby.pos, this.name)
    return baby
  }

  public genderToString(): string {
    return 'woman'
  }
}
