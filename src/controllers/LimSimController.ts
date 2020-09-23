import SimulationModel from '../models/mongo-collections/SimulationSchema'
import { SimulationData } from '../types'
import SimulationService from '../services/core/Simulation'
import SimStateController from './SimStateController'

export default class LimSimController {
  public static async store(
    sim: SimulationService,
    states: SimulationData[]
  ): Promise<unknown> {
    const sims = new SimulationModel({
      _id: sim.name,
      initialStats: {
        healthy: sim.stats.healthy,
        infected: sim.stats.infected,
        dead: sim.stats.dead,
        immune: sim.stats.immune
      },
      city: {
        size: {
          x: sim.map.sizeX,
          y: sim.map.sizeY
        },
        mapType: sim.map.toString()
      },
      time: {
        initial: sim.time.initialTime,
        final: sim.time.finalTime,
        modifier: sim.time.modifier
      },
      logs: sim.hasLogs
    })
    await sims.save()
    await SimStateController.store(sims.id, states)

    return {
      simName: sims.id,
      states,
      initialTime: sim.time.initialTime,
      finalTime: sim.time.finalTime
    }
  }
}
