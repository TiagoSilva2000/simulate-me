// import { Request, Response } from 'express'
import SimStateModel from '../models/mongo-collections/SimStateSchema'
import { SimulationData } from '../types'

export default class SimStateController {
  static async loadStates(simulationId: unknown): Promise<unknown> {
    const loadedStates = await SimStateModel.find()
      .where({ simulationId })
      .select('-simulationId -_id')
      .sort('year')
      .lean()

    return loadedStates
  }

  static async store(simId: unknown, states: SimulationData[]): Promise<void> {
    for await (const stt of states) {
      const state = new SimStateModel({
        simulationId: simId,
        map: stt.map,
        year: stt.year,
        stats: {
          healthy: stt.stats.healthy,
          dead: stt.stats.dead,
          immune: stt.stats.immune,
          infected: stt.stats.infected
        },
        citizens: stt.citizens,
        logs: stt.logs
      })
      state.save()
    }
  }
}
