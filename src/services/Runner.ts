import { PopulationDefaultData, SimulationData } from '../types'
import { Request } from 'express'
import Time from './core/Time'
import City from './core/City'
import Simulation from './core/Simulation'

export class Runner {
  static async runSimulation(
    req: Request
  ): Promise<{ sim: Simulation; states: SimulationData[] }> {
    const { simName } = req.params
    const {
      sizeX,
      sizeY,
      citizens: includeCitizens,
      initialPopulation,
      initialYear,
      finalYear,
      modifier,
      unlimited: reqUnlimited,
      logs: reqLog,
      hw,
      hm,
      iw,
      im
    } = req.query
    let unlimited = false
    let defaultPopulation: undefined | PopulationDefaultData
    const logs = Boolean(reqLog)

    if (reqUnlimited === 'true') unlimited = true
    if (hw && hm && iw && im)
      defaultPopulation = {
        healthyWoman: Number(hw),
        healthyMan: Number(hm),
        infectedWoman: Number(iw),
        infectedMan: Number(im)
      }

    const sim: Simulation = new Simulation({
      name: simName,
      logs,
      city: new City({ sizeX: Number(sizeX), sizeY: Number(sizeY) }),
      time: new Time({
        initialYear: Number(initialYear),
        finalYear: Number(finalYear),
        modifier: Number(modifier),
        timeUnlimited: Boolean(unlimited)
      }),
      includeCitizens: Boolean(includeCitizens),
      popData: {
        initialPopulation: Number(initialPopulation) || undefined,
        defaultPopulation
      }
    })
    const states = sim.run()

    return { sim, states }
  }
}
