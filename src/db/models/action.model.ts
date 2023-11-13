import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { IUser } from '@db/models/user.model'

interface IAction {
  _id: string
  id: string
  title: string
  description: string
  image?: string
  location: {
    lat: string
    lng: string
  }
  SDGs: string[]
  startDate?: Date
  endDate: Date
  creator: IUser
  participants: IUser[]
  followers: IUser[]
  donations: {
    amount: number
    donator: IUser
  }[]
  progress: {
    image?: string
    description: string
  }[]
  comments: {
    comment: string
    commentor: IUser
  }[]
  createdAt?: Date
  updatedAt?: Date
}

const actionSchema = new Schema<IAction>(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    location: {
      lat: { type: String },
      lng: { type: String },
    },
    SDGs: [{ type: String, ref: 'SDG', required: true }],
    startDate: { type: Date },
    endDate: { type: Date, required: true },
    creator: {
      type: String,
      ref: 'User',
      required: true,
    },
    participants: [{ type: String, ref: 'User' }],
    followers: [{ type: String, ref: 'User' }],
    donations: [
      {
        amount: { type: Number, required: true },
        donator: { type: String, ref: 'User', required: true },
      },
    ],
    progress: [
      {
        image: { type: String },
        description: { type: String, required: true },
      },
    ],
    comments: [
      {
        comment: { type: String, required: true },
        commentor: { type: String, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true },
)

// Virtual for _id
actionSchema.virtual('id').get(function () {
  return this._id
})

// JSON serializatoin logic
actionSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
actionSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// custom validation logic for location
actionSchema.path('location')?.validate(function (location) {
  if (!location) return true // If location is not provided, it's valid
  return location.lat && location.lng // If location is provided, both lat and lng must be present
}, 'If location is provided, both lat and lng are required.')

export const Action = model<IAction>('Action', actionSchema)
