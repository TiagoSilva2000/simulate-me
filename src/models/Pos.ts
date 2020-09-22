/* eslint-disable no-useless-constructor */

export default class Pos {
  public constructor(private _x: number, private _y: number) {}

  get x(): number {
    return this._x
  }

  set x(newX: number) {
    this._x = newX
  }

  get y(): number {
    return this._y
  }

  set y(newY: number) {
    this._y = newY
  }

  public moveTo(pos: Pos): Pos {
    this._x = pos.x
    this._y = pos.y

    return this
  }

  public isClose(pos: Pos): boolean {
    const diffX = Math.abs(pos._x - this._x)
    const diffY = Math.abs(pos._y - this._y)

    return diffX <= 1 && diffY <= 1 && diffX !== diffY
  }

  public nextPositions(): Pos[] {
    const northPos = new Pos(this._x - 1, this._y)
    const southPos = new Pos(this._x + 1, this._y)
    const eastPos = new Pos(this._x, this._y + 1)
    const westPos = new Pos(this._x, this._y - 1)
    const nPositions = [northPos, southPos, eastPos, westPos]

    let j: number
    let temp: Pos
    for (let i = nPositions.length - 1; i >= 1; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = nPositions[j]
      nPositions[j] = nPositions[i]
      nPositions[i] = temp
    }

    return nPositions
  }

  public toString(): string {
    return `(${this._x}, ${this._y})`
  }

  public equalsTo(pos: Pos): boolean {
    return this._x === pos.x && this._y === pos.y
  }
}
