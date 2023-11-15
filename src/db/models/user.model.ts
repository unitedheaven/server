import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser {
  _id: string
  id: string
  username: string
  profilePicture?: string
  createdAt?: Date
  updatedAt?: Date
}

export const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    username: { type: String, required: true },
    profilePicture: { type: String },
  },
  { timestamps: true },
)

// Virtual for _id
userSchema.virtual('id').get(function () {
  return this._id
})

// JSON serializatoin logic
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

// Object serialization logic
userSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

export const User = model<IUser>('User', userSchema)
