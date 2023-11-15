import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { IUser } from '@db/models/user.model'

export interface IAction {
  _id: string
  id: string
  title: string
  description: string
  image?: string
  location?: string
  onlineUrl?: string
  SDGs: string[]
  startDate?: Date
  endDate: Date
  isParticipatory: boolean
  isDonatable: boolean
  maxDonationAmount: number
  creator: IUser
  participants: IUser[]
  followers: IUser[]
  donations: {
    amount: number
    donator: IUser
    date?: Date
  }[]
  withdrawals: {
    amount: number
    message: string
    date?: Date
  }[]
  progress: {
    message: string
    date?: Date
  }[]
  createdAt: Date
  updatedAt: Date
  currentContractValue(): number
  totalDonationAmount(): number
  totalParticipantCount(): number
  totalFollowerCount(): number
  isFollowedByUser(userId: string): boolean
  isParticipatedByUser(userId: string): boolean
  isDonatedByUser(userId: string): boolean
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
    location: { type: String },
    onlineUrl: { type: String },
    SDGs: [{ type: String, ref: 'SDG', required: true }],
    startDate: { type: Date },
    endDate: { type: Date, required: true },
    isParticipatory: { type: Boolean, required: true },
    isDonatable: { type: Boolean, required: true },
    maxDonationAmount: { type: Number, required: true },
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
        date: { type: Date, required: true, default: Date.now },
      },
    ],
    withdrawals: [
      {
        amount: { type: Number, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
    progress: [
      {
        message: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      currentContractValue(): number {
        const totalWithdrawalAmount: number = this.withdrawals.reduce(
          (total, withdrawal) => {
            return total + withdrawal.amount
          },
          0,
        )

        const totalDonationAmount: number = this.donations.reduce(
          (total, donation) => {
            return total + donation.amount
          },
          0,
        )

        return totalDonationAmount - totalWithdrawalAmount
      },

      totalDonationAmount(): number {
        return this.donations.reduce((total, donation) => {
          return total + donation.amount
        }, 0)
      },

      totalParticipantCount(): number {
        return this.participants.length
      },

      totalFollowerCount(): number {
        return this.followers.length
      },

      isFollowedByUser(userId: string): boolean {
        if (!userId) return false
        return this.followers.some(follower => {
          return follower.id == userId
        })
      },

      isParticipatedByUser(userId: string): boolean {
        if (!userId) return false
        return this.participants.some(participant => {
          return participant.id == userId
        })
      },

      isDonatedByUser(userId: string): boolean {
        if (!userId) return false
        return this.donations.some(donation => {
          return donation.donator.id == userId
        })
      },
    },
  },
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
// actionSchema.path('location')?.validate(function (location) {
//   if (!location) return true // If location is not provided, it's valid
//   return location.lat && location.lng // If location is provided, both lat and lng must be present
// }, 'If location is provided, both lat and lng are required.')

export const Action = model<IAction>('Action', actionSchema)
