import { Request, Response } from 'express'
import { Runner } from '../services/Runner'
import SimulationModel from '../models/mongo-collections/SimulationSchema'
import LimSimController from './LimSimController'
import SimStateController from './SimStateController'

export default class SimController {
  static async show(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params

    const sim = await SimulationModel.findById(simName).lean()
    if (!sim) {
      return res.send({ exists: false })
    }

    return res.send(sim)
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params
    const sim = await SimulationModel.findByIdAndDelete(simName)

    return res.send(sim)
  }

  static async exists(req: Request, res: Response): Promise<Response> {
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

  // static async loadStates(req: Request, res: Response): Promise<Response> {
  //   return response.send({hi:'hi'})
  // }
  //   if (sim) {
  //     if (!sim.time.limited && unlimitedRunSimulation && !sim.newStatesLocked) {
  //       return res.send(
  //         await UnlimSimController.runUnlimited(includeCitizens, sim)
  //       )
  //     }
  //   }
  // }

  static async getOrCreate(req: Request, res: Response): Promise<Response> {
    const { simName } = req.params
    const sim = await SimulationModel.findById(simName)

    if (sim) {
      const loadedStates = await SimStateController.loadStates(simName)
      return res.send({
        simName: sim._id,
        initialTime: sim.time.initial,
        finalTime: sim.time.final,
        states: loadedStates
      })
    }
    const { sim: appSim, states } = await Runner.runSimulation(req)

    if (!appSim.time.unlimited) {
      return res.send(await LimSimController.store(appSim, states))
    }

    return res.send({ message: 'unlimited' })
  }
}
