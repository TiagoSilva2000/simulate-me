// import mongoose, { Model, Schema, Document } from 'mongoose'

// type LogDocument = Document & {
//   content: string[]
//   stateId: Schema.Types.ObjectId
// }

// type LogModel = Model<LogDocument>

// const LogSchema = new Schema(
//   {
//     content: {
//       type: [String],
//       required: false,
//       default: []
//     }
//     // stateId: {
//     //   type: Schema.Types.ObjectId,
//     //   ref: 'SimState',
//     //   required: true
//     // }
//   },
//   {
//     timestamps: false,
//     versionKey: false,
//     skipVersioning: true,
//     strict: true
//   }
// )

// export default mongoose.model<LogDocument, LogModel>('logs', LogSchema)
