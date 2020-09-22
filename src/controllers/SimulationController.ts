import { Request, Response } from 'express'
import City from '../models/City'
import Time from '../models/Time'
import SimStateModel from '../schemas/SimStateSchema'
import SimulationModel, {
  SimulationDocument
} from '../schemas/SimulationSchema'
import { PopulationDefaultData } from '../interfaces'
import Simulation from '../models/Simulation'

export default class SimulationController {
  static async index(req: Request, res: Response): Promise<Response> {
    const sims = await SimulationModel.find({}).lean()

    return res.send(sims)
  }

  static async show(req: Request, res: Response): Promise<Response> {
    const { simId } = req.params
    const sim = await SimulationModel.findById(simId).lean()

    if (!sim) return res.send({ message: 'error while requesting simulation' })

    return res.send(sim)
  }

  static async store(req: Request, res: Response): Promise<Response> {
    const { initialStats, city, time } = req.body

    const sim = new SimulationModel({
      initialStats,
      city,
      time
    })

    await sim.save()

    return res.send(sim)
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const { simId } = req.params
    const { finalStats } = req.body

    const sim = await SimulationModel.findByIdAndUpdate(
      simId,
      { finalStats },
      { runValidators: true, new: true }
    )

    if (!sim) return res.send({ message: 'error while updating simulation' })

    return res.send(sim)
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const { simId } = req.params
    const sim = await SimulationModel.findByIdAndDelete(simId)

    return res.send(sim)
  }

  private static async createSimulation(req: Request): Promise<unknown> {
    const {
      sizeX,
      sizeY,
      citizens: includeCitizens,
      initialPopulation,
      initialYear,
      finalYear,
      modifier,
      unlimited: timeUnlimited,
      logs: reqLog,
      hw,
      hm,
      iw,
      im
    } = req.query
    let defaultPopulation: undefined | PopulationDefaultData
    if (hw && hm && iw && im)
      defaultPopulation = {
        healthyWoman: Number(hw),
        healthyMan: Number(hm),
        infectedWoman: Number(iw),
        infectedMan: Number(im)
      }
    const logs = Boolean(reqLog)
    const { simName } = req.params

    const sim: Simulation = new Simulation({
      city: new City({ sizeX: Number(sizeX), sizeY: Number(sizeY) }),
      time: new Time({
        initialYear: Number(initialYear),
        finalYear: Number(finalYear),
        modifier: Number(modifier),
        timeUnlimited: Boolean(timeUnlimited)
      }),
      includeCitizens: Boolean(includeCitizens) || true,
      popData: {
        initialPopulation: Number(initialPopulation) || undefined,
        defaultPopulation
      }
    })

    const sims = new SimulationModel({
      _id: simName,
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
      logs: logs
    })
    await sims.save()
    const states = sim.run(logs)

    for await (const stt of states) {
      const state = new SimStateModel({
        simulationId: sims.id,
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
      simName: sims.id,
      states,
      initialTime: sim.time.initialTime,
      finalTime: sim.time.finalTime
    }
  }

  static async runUnlimited(
    includeCitizens: unknown,
    sim: SimulationDocument
  ): Promise<unknown> {
    const states = await SimStateModel.find()
      .where({ simulationId: sim.id })
      .select('-_id -simulationId')
      .lean()

    const simulation: Simulation = new Simulation({
      city: new City({ sizeX: sim.city.size.x, sizeY: sim.city.size.y }),
      time: new Time({
        initialYear: states[states.length - 1].year,
        finalYear: sim.time.final,
        modifier: sim.time.modifier,
        timeUnlimited: true
      }),
      includeCitizens: Boolean(includeCitizens) || true,
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
      newStates
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

  static async getOrCreate(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params
    const { unlimitedRunSimulation, includeCitizens } = req.query
    const sim = await SimulationModel.findById(simName)

    if (sim) {
      if (!sim.time.limited && unlimitedRunSimulation && !sim.newStatesLocked) {
        return res.send(
          await SimulationController.runUnlimited(includeCitizens, sim)
        )
      }
      const states = await SimStateModel.find()
        .where({ simulationId: simName })
        .select('-simulationId -_id')
        .sort('year')
        .lean()
      return res.send({
        simName: sim._id,
        initialTime: sim.time.initial,
        finalTime: sim.time.final,
        states
      })
    }
    return res.send(await SimulationController.createSimulation(req))
  }

  static async simExists(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params

    const sim = await SimulationModel.findById(simName).lean()
    if (!sim) {
      return res.send({ exists: false })
    }

    return res.send({
      exists: true,
      limited: sim.time.limited,
      locked: sim.newStatesLocked
    })
  }
}
