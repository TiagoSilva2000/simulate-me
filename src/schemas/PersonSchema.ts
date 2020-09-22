import { Schema } from 'mongoose'
import Position, { PositionSchema } from './PositionSchema'
import Status, { StatusSchema } from './StatusSchema'

export const PersonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    pos: {
      type: PositionSchema,
      required: true,
      default: new Position({ x: 0, y: 0 })
    },
    infectionAge: {
      type: Number,
      required: false,
      default: null
    },
    status: {
      type: StatusSchema,
      required: false,
      default: new Status()
    }
  },
  {
    minimize: false,
    _id: false,
    id: false,
    versionKey: false
  }
)
