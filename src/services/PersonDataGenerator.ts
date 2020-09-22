import faker from 'faker'

export default class PersonDataGenerator {
  public static randomName(): string {
    return faker.name.findName()
  }

  public static randomAge(): number {
    return Math.floor(Math.random() * 21)
  }
}
