import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ISDG {
  _id: string
  id: string
  number: number
  title: string
  facts?: [string]
  followers: [{ type: string; ref: 'User' }]
}

export const SDGSchema = new Schema<ISDG>({
  _id: { type: String, required: true, default: uuidv4 },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  facts: [{ type: String }],
  followers: [{ type: String, ref: 'User' }],
})

// Virtual for _id
SDGSchema.virtual('sdgId').get(function () {
  return this._id
})

// JSON serializatoin logic
SDGSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
SDGSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const SDG = model<ISDG>('SDG', SDGSchema)
