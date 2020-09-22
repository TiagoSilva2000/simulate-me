import Express from 'express'
import Routes from './routes'
import Mongoose from 'mongoose'
import Cors from 'cors'
import { MongoURI } from './config/database'

class App {
  public connection: Express.Express

  public constructor() {
    const uri = MongoURI()
    this.connection = Express()
    this.connection.use(Express.json())
    this.connection.use(Express.urlencoded({ extended: true }))
    this.connection.use(Cors())
    this.connection.use(Routes)
    Mongoose.connect(uri, {
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
