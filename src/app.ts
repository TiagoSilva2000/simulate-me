import Express from 'express'
import Routes from './routes'
import Mongoose from 'mongoose'
import Cors from 'cors'

class App {
  public connection: Express.Express

  public constructor() {
    this.connection = Express()
    this.connection.use(Express.json())
    this.connection.use(Express.urlencoded({ extended: true }))
    this.connection.use(Cors())
    this.connection.use(Routes)
    Mongoose.connect('mongodb://localhost:27017/poo-disease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
      // autoCreate: true,
      // autoIndex: true
      // bufferCommands: false,
    }).catch(error => console.log(error))

    Mongoose.connection.on('error', err => {
      console.log(err)
    })
  }
}

export default new App().connection
