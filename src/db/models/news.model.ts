import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface INews {
  _id: string
  id: string
  title: string
  image: string
  date: Date
  link: string
  SDGs: string[]
}

export const NewsSchema = new Schema<INews>({
  _id: { type: String, required: true, default: uuidv4 },
  title: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },
  link: { type: String, required: true },
  SDGs: [{ type: String, ref: 'SDG', required: true }],
})

// Virtual for _id
NewsSchema.virtual('id').get(function () {
  return this._id
})

// JSON serializatoin logic
NewsSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
NewsSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const News = model<INews>('News', NewsSchema)
