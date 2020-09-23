import SimulationController from './controllers/SimulationController'
import { Router } from 'express'
// import LimSimController from './controllers/LimSimController'

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
    this.routes.get('/simulations/:simName/exists', SimulationController.exists)
    this.routes.get('/:simName', SimulationController.show)
    this.routes.delete('/:simName', SimulationController.delete)
    // this.routes.get('/simulations', SimulationController.index)
    // this.routes.post('/simulation/create', SimulationController.store)
    // this.routes.put('/simulation/:simId', SimulationController.update)
  }
}

export default new Routes().routes
