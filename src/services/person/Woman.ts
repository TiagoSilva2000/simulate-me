import Logger from '../utils/Logger'
import City from '../core/City'
import Man from './Man'
import { Person } from './Person'
import { Gender } from '../../constants'
import DataGenerator from '../../services/utils/DataGenerator'
import { ClosePeopleCategory } from '../../types'

export default class Woman extends Person {
  public giveBirth(city: City, man: Person): Person {
    let baby: Person

    if (man.age > this.age)
      baby = new Man({
        city: city,
        age: 0
      })
    else
      baby = new Woman({
        city: city,
        age: 0
      })

    Logger.BORN(baby.name, baby.pos, this.name)
    return baby
  }

  public gender(): Gender {
    return Gender.WOMAN
  }

  public interact(
    city: City,
    closePeople: ClosePeopleCategory,
    dataGen: DataGenerator
  ): void {
    super.interact(city, closePeople, dataGen)
    if (!this.canCopulate() || !closePeople.partner) return
    city.createCitizen(this.giveBirth(city, closePeople.partner))
  }
}
