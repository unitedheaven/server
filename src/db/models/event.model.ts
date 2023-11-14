import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IEvent {
  _id: string
  id: string
  title: string
  image: string
  date: Date
  location: string
  link: string
  SDGs: string[]
}

export const EventSchema = new Schema<IEvent>({
  _id: { type: String, required: true, default: uuidv4 },
  title: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  link: { type: String, required: true },
  SDGs: [{ type: String, ref: 'SDG', required: true }],
})

// Virtual for _id
EventSchema.virtual('id').get(function () {
  return this._id
})

// JSON serializatoin logic
EventSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
EventSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const Event = model<IEvent>('Event', EventSchema)
