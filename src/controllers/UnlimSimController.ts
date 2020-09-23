import { Request } from 'express'
import City from '../services/core/City'
import Time from '../services/core/Time'
import SimStateModel from '../models/mongo-collections/SimStateSchema'
import SimulationModel, {
  SimulationDocument
} from '../models/mongo-collections/SimulationSchema'
import Simulation from '../services/core/Simulation'
import { SimulationData } from '../types'
import SimStateController from './SimStateController'

export default class UnlimSimController {
  static async runUnlimited(sim: SimulationDocument): Promise<unknown> {
    const states = await SimStateModel.find()
      .where({ simulationId: sim.id })
      .select('-_id -simulationId')
      .lean()

    const simulation: Simulation = new Simulation({
      name: sim.id,
      city: new City({ sizeX: sim.city.size.x, sizeY: sim.city.size.y }),
      time: new Time({
        initialYear: states[states.length - 1].year,
        finalYear: sim.time.final,
        modifier: sim.time.modifier,
        timeUnlimited: true
      }),
      includeCitizens: true,
      popData: {
        populationInfo: states[states.length - 1].citizens
      }
    })

    const newStates = simulation.run()

    sim.newStatesLocked = true

    await sim.save()
    return {
      simulationId: sim.id,
      oldStates: states,
      newStates,
      newStatesLocked: true
    }
  }

  static async store(
    sim: Simulation,
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
    sims.newStatesLocked = true
    await sims.save()
    await SimStateController.store(sims.id, states)
    return {
      simulationId: sims.id,
      states,
      newStatesLocked: true
    }
  }

  static async unlockUnlimitedSimulation(req: Request): Promise<unknown> {
    const { states, simId } = req.body
    const sim = await SimulationModel.findById(simId)
    if (!sim || !states) return { message: 'failed' }

    sim.newStatesLocked = false
    await sim.save()
    for await (const stt of states) {
      const state = new SimStateModel({
        simulationId: sim.id,
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

    return {
      message: 'success'
    }
  }
}
