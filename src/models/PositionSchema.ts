import mongoose, { Document, Model, Schema } from 'mongoose'

type PosDocument = Document & {
  x: number
  y: number
}

type PosModel = Model<PosDocument>

export const PositionSchema = new Schema(
  {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  {
    id: false,
    _id: false,
    versionKey: false
  }
)

export default mongoose.model<PosDocument, PosModel>('Position', PositionSchema)
