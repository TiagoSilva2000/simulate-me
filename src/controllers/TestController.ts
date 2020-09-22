import { Request, Response } from 'express'
import City from '../models/City'
import Time from '../models/Time'
import path from 'path'
import SimState from '../schemas/SimStateSchema'
// import { SimulationNeededData } from '../interfaces'
import Simulation from '../models/Simulation'
import SimulationModel from '../schemas/SimulationSchema'

export default class SimulationController {
  static async show(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params
    const {
      sizeX,
      sizeY,
      includeCitizens,
      initialPopulation,
      initialYear,
      lastYear,
      modifier,
      timeUnlimited
    } = req.query

    const sim: Simulation = new Simulation({
      city: new City({ sizeX: Number(sizeX), sizeY: Number(sizeY) }),
      time: new Time({
        initialYear: Number(initialYear),
        finalYear: Number(lastYear),
        modifier: Number(modifier),
        timeUnlimited: Boolean(timeUnlimited)
      }),
      includeCitizens: Boolean(includeCitizens) || true,
      popData: {
        initialPopulation: Number(initialPopulation) || undefined,
        populationFilePath: path.resolve(
          __dirname,
          '..',
          '..',
          'public',
          'docs',
          'first.csv'
        )
      }
    })

    const sims = new SimulationModel({
      simName,
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
      }
    })

    await sims.save()

    const states = sim.run()

    for await (const stt of states) {
      const state = new SimState({
        simulationId: sims.id,
        map: stt.map,
        year: stt.year,
        stats: {
          healthy: stt.stats.healthy,
          dead: stt.stats.dead,
          immune: stt.stats.immune,
          infected: stt.stats.infected
        },
        citizens: stt.citizens
      })
      state.save()
    }

    return res.send({
      simName,
      states,
      initialTime: sim.time.initialTime,
      finalTime: sim.time.finalTime
    })
  }

  static async erase(req: Request, res: Response): Promise<Response> {
    await SimulationModel.findOneAndDelete({})
    await SimState.findOneAndDelete({})

    return res.send({ message: 'success' })
  }

  // static async recover(req: Request, res: Response): Promise<Response> {
  //   const { simulationId, currentYear } = req.query
  // }
}
