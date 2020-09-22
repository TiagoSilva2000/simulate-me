import SimulationController from './controllers/SimulationController'
import { Router } from 'express'

class Routes {
  public routes: Router

  public constructor() {
    this.routes = Router()
    this.simulationRoutes()
    this.testRoutes()
  }

  private testRoutes() {
    this.routes.get('/', (req, res) => res.send('<h1>Running Backend<h1/>'))
  }

  private simulationRoutes() {
    this.routes.get('/simulations/:simName', SimulationController.getOrCreate)
    this.routes.get(
      '/simulations/:simName/exists',
      SimulationController.simExists
    )
    this.routes.get('/simulations', SimulationController.index)
    this.routes.post('/simulation/create', SimulationController.store)
    this.routes.get('/simulation/:simId', SimulationController.show)
    this.routes.put('/simulation/:simId', SimulationController.update)
    this.routes.delete('/simulation/', SimulationController.delete)
  }
}

export default new Routes().routes
