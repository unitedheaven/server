import { model, Schema } from 'mongoose'

export interface IUser {
  username: string
  createdAt?: Date
  updatedAt?: Date
}

export const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
  },
  { timestamps: true },
)

export const User = model<IUser>('User', userSchema)
