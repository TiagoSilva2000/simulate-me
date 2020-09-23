import Pos from '../core/Pos'

export default class Logger {
  public static LOGS: string[] = []

  public static START(): string {
    return 'Nothing Yet'
  }

  public static NOTHING(): string {
    return 'Nothing Happened'
  }

  public static CLEAR(): void {
    this.LOGS = []
  }

  public static CREATED(name: string, age: number, pos: Pos): void {
    this.LOGS.push(
      `${name}(${age}) WAS magically CREATED at (${pos.x}, ${pos.y})`
    )
  }

  public static INFECT(
    agentName: string,
    p1: Pos,
    pacientName: string,
    p2: Pos
  ): string {
    return `${agentName}(${p1.x}, ${p1.y}) INFECTED ${pacientName}(${p2.x}, ${p2.y})`
  }

  public static GETINFECTED(
    agentName: string,
    p1: Pos,
    pacientName: string,
    p2: Pos
  ): string {
    return `${pacientName}(${p2.x}, ${p2.y}) WAS INFECTED by ${agentName}(${p1.x}, ${p1.y})`
  }

  public static DIE(name: string, pos: Pos, age: number): string {
    return `${name}(${age}) DIED at (${pos.x}, ${pos.y})`
  }

  public static BORN(babyName: string, pos: Pos, mothersName: string): string {
    return `${babyName} BORNED at (${pos.x}, ${pos.y}) FROM ${mothersName}`
  }

  public static GETIMMUNE(name: string, age: number): string {
    return `${name}(${age}) BECAME IMMUNE`
  }
}
