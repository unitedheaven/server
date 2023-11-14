import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// import { ISDG } from '@db/models/sdg.model'
import { IUser } from 'db/models/user.model'

export interface ICharity {
  _id: string
  id: string
  name: string
  rating: number
  score: number
  link: string
  SDGs: string[]
  followers?: IUser[]
}

export const CharitySchema = new Schema<ICharity>({
  _id: { type: String, required: true, default: uuidv4 },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  score: { type: Number, required: true },
  link: { type: String, required: true },
  SDGs: [{ type: String, ref: 'SDG', required: true }],
  followers: [{ type: String, ref: 'User' }],
})

// Virtual for _id
CharitySchema.virtual('id').get(function () {
  return this._id
})

// JSON serializatoin logic
CharitySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
CharitySchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const Charity = model<ICharity>('Charity', CharitySchema)
