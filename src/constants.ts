export enum Status {
  EMPTY,
  ERROR,
  RANDOM,
  HEALTHY,
  INFECTED,
  IMMUNE,
  DEAD
}

export enum Gender {
  WOMAN,
  MAN
}

export enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST
}

export const DEFAULT = {
  map_size: {
    X: 10,
    Y: 10
  },
  age: {
    MAX_INITIAL: 20
  },
  time: {
    INITIAL: 0,
    FINAL: 32,
    MODIFIER: 1,
    UNLIMITED: false
  },
  status: Status.HEALTHY,
  population: {
    HW: 10, // healthy woman
    IW: 1, // infected woman
    HM: 10, // healthy man
    IM: 1 // infected man
  }
}
