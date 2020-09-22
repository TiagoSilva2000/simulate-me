import { Stats } from 'interfaces'
import mongoose, { Document, Model, Schema } from 'mongoose'

export const StatsSchema = new Schema(
  {
    healthy: {
      type: Number,
      required: true
    },
    infected: {
      type: Number,
      required: true
    },
    immune: {
      type: Number,
      required: true
    },
    dead: {
      type: Number,
      required: true
    }
  },
  {
    _id: false,
    id: false
  }
)

export type SimulationDocument = Document & {
  createdAt: Date
  initialStats: Stats
  finalStats: Stats
  city: {
    size: {
      x: number
      y: number
    }
  }
  mapType: string
  time: {
    limited: boolean
    initial: number
    final: number
    modifier: number
  }
  newStatesLocked: boolean
  logs: boolean
}

type SimulationModel = Model<SimulationDocument>

const SimulationSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    initialStats: {
      type: StatsSchema,
      required: true
    },
    finalStats: {
      type: StatsSchema,
      required: false,
      default: undefined
    },
    city: {
      size: {
        x: {
          type: Number,
          required: true
        },
        y: {
          type: Number,
          required: true
        }
      },
      mapType: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      }
    },
    time: {
      limited: {
        type: Boolean,
        required: false,
        default: true
      },
      initial: {
        type: Number,
        required: true
      },
      final: {
        type: Number,
        required: true
      },
      modifier: {
        type: Number,
        required: false,
        default: 1
      }
    },
    newStatesLocked: {
      type: Boolean,
      required: false,
      default: false
    },
    logs: {
      type: Boolean,
      required: false,
      default: false
    },
    createdAt: {
      type: Date,
      allowNull: false,
      default: new Date()
    }
  },
  {
    strict: true,
    minimize: false,
    versionKey: false,
    skipVersioning: true
  }
)

export default mongoose.model<SimulationDocument, SimulationModel>(
  'Simulation',
  SimulationSchema
)
