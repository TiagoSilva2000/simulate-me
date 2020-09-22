import { Status } from '../constants'
import mongoose, { Model, Document, Schema } from 'mongoose'

type StatusDocument = Document & {
  info: number
}

type StatusModel = Model<StatusDocument>

export const StatusSchema = new Schema(
  {
    info: {
      type: Number,
      enum: [
        Status.HEALTHY,
        Status.INFECTED,
        Status.DEAD,
        Status.IMMUNE,
        Status.EMPTY,
        Status.ERROR
      ],
      required: false,
      default: Status.HEALTHY
    }
  },
  {
    id: false,
    _id: false,
    versionKey: false
  }
)

export default mongoose.model<StatusDocument, StatusModel>(
  'Status',
  StatusSchema
)
