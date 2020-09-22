import { Status } from '../../constants'
import mongoose, { Document, Schema, Model } from 'mongoose'
import { SimStateData } from '../../types'
// import { PersonSchema } from './PersonSchema'
// import { PersonData } from '../models/utils/Simulation'
import { StatsSchema } from './SimulationSchema'

type SimStateDocument = Document &
  SimStateData & {
    simulationId: Schema.Types.ObjectId
  }

type SimStateModel = Model<SimStateDocument>

const SimStateSchema = new Schema(
  {
    simulationId: {
      type: String,
      ref: 'Simulation'
    },
    map: {
      type: [[Number]],
      enum: [
        Status.HEALTHY,
        Status.INFECTED,
        Status.DEAD,
        Status.IMMUNE,
        Status.EMPTY,
        Status.ERROR
      ],
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    stats: {
      type: StatsSchema,
      required: true
    },
    citizens: [
      {
        name: String,
        age: Number,
        infectionAge: Number,
        pos: {
          x: Number,
          y: Number
        },
        status: Number
      }
    ],
    logs: {
      type: [String],
      required: false
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export default mongoose.model<SimStateDocument, SimStateModel>(
  'SimState',
  SimStateSchema
)
