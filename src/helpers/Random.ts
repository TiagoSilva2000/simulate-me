import faker from 'faker'
import { Person } from '../services/person/Person'
import { Gender } from '../constants'
import Pos from '../services/core/Pos'
import CityMap from '../services/map/CityMap'

export default class Random {
  public static genName(p: Person): string {
    if (p.gender() === Gender.MAN) {
      return faker.name.findName(undefined, undefined, 0)
    }

    return faker.name.findName(undefined, undefined, 1)
  }

  public static genAge(): number {
    return Math.floor(Math.random() * 21)
  }

  public static genPos(map: CityMap): Pos {
    return map.getAvailableRandomPosition()
  }

  public static genPopulationSet(max: number): number[] {
    const popNumbers: number[] = []

    for (let i = 0; i < max; i++) {
      popNumbers.push(Math.floor(Math.random() * 2))
    }

    return popNumbers
  }

  public static shuffle(array: unknown[]): unknown[] {
    let j: number
    let temp: unknown
    const shuffled = [...array]
    for (let i = array.length - 1; i >= 1; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = shuffled[j]
      shuffled[j] = shuffled[i]
      shuffled[i] = temp
    }

    return shuffled
  }
}
