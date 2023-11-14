import { model, Schema } from 'mongoose'

import { IUser } from '@db/models/user.model'

export interface ISDG {
  _id: string
  id: string
  number: number
  title: string
  facts?: string[]
  followers: IUser[]
  isFollowedByUser(userId: string): boolean
}

export const SDGSchema = new Schema<ISDG>(
  {
    _id: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    facts: [{ type: String }],
    followers: [{ type: String, ref: 'User' }],
  },
  {
    methods: {
      isFollowedByUser(userId: string): boolean {
        if (!userId) return false
        return this.followers.some(follower => {
          return follower.id == userId
        })
      },
    },
  },
)

// Virtual for _id
SDGSchema.virtual('id').get(function () {
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
