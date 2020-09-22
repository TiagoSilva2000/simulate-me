/* eslint-disable no-useless-constructor */

export default class Pos {
  private readonly _diagonalAllowed: boolean
  public constructor(
    private _x: number,
    private _y: number,
    diagonalAllowed?: boolean
  ) {
    this._diagonalAllowed = diagonalAllowed || false
  }

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

  get diagonalAllowed(): boolean {
    return this._diagonalAllowed
  }

  private isInDiagonal(p: Pos): boolean {
    const diffX = Math.abs(p._x - this._x)
    const diffY = Math.abs(p._y - this._y)

    return diffX === diffY
  }

  public movementAllowed(p: Pos): boolean {
    return (
      !this._diagonalAllowed || (this._diagonalAllowed && this.isInDiagonal(p))
    )
  }

  public moveTo(pos: Pos): Pos {
    if (!this.movementAllowed(pos)) throw new Error('movement not allowed')
    this._x = pos.x
    this._y = pos.y

    return this
  }

  public equalsTo(pos: Pos): boolean {
    return this._x === pos._x && this._y === pos._y
  }

  public toString(): string {
    return `(${this._x}, ${this._y})`
  }

  public isClose(pos: Pos): boolean {
    const diffX = Math.abs(pos._x - this._x)
    const diffY = Math.abs(pos._y - this._y)
    const diagonalIncluded = !(diffX === diffY && !this._diagonalAllowed)

    return diffX <= 1 && diffY <= 1 && diagonalIncluded
  }

  private diagonalClosePositions(): Pos[] {
    const northeast = new Pos(this._x - 1, this._y + 1)
    const southeast = new Pos(this._x + 1, this._y + 1)
    const northwest = new Pos(this._x - 1, this._y - 1)
    const southwest = new Pos(this._x + 1, this._y - 1)

    return [northeast, southeast, northwest, southwest]
  }

  public closePositions(): Pos[] {
    const north = new Pos(this._x - 1, this._y)
    const south = new Pos(this._x + 1, this._y)
    const east = new Pos(this._x, this._y + 1)
    const west = new Pos(this._x, this._y - 1)
    const positions = [north, south, east, west]

    if (this._diagonalAllowed) {
      return positions.concat(this.diagonalClosePositions())
    }

    return positions
  }
}
