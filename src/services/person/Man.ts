/* eslint-disable @typescript-eslint/no-unused-vars */
import { Gender } from '../../constants'
import { Person } from './Person'

export default class Man extends Person {
  public gender(): Gender {
    return Gender.MAN
  }
}
