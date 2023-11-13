import { model, Schema, ObjectId } from 'mongoose'

// export interface IAction {
//   title: string
//   description: string
//   image: string
//   location: {
//     lat: number
//     lng: number
//   }
//   sdgs: [{ type: Schema.Types.ObjectId; ref: 'SDG' }]
//   startDate?: Date
//   endDate: Date
//   creator: { type: Schema.Types.ObjectId; ref: 'User' }
//   participants: [{ type: Schema.Types.ObjectId; ref: 'User' }]
//   followers: [{ type: Schema.Types.ObjectId; ref: 'User' }]
//   donations: [
//     { amount: number; donator: { type: Schema.Types.ObjectId; ref: 'User' } },
//   ]
//   progress: [{ image?: string; description: string }]
//   comments: [
//     { commetor: { type: Schema.Types.ObjectId; ref: 'User' }; comment: string },
//   ]
// }

interface IAction {
  title: string
  description: string
  image?: string
  location: {
    lat: string
    lng: string
  }
  SDGs: ObjectId[]
  startDate?: Date
  endDate: Date
  creator: ObjectId
  participants: ObjectId[]
  followers: ObjectId[]
  donations: {
    amount: number
    donator: ObjectId
  }[]
  progress: {
    image?: string
    description: string
  }[]
  comments: {
    comment: string
    commentor: ObjectId
  }[]
  createdAt?: Date
  updatedAt?: Date
}

const actionSchema = new Schema<IAction>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    location: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
    },
    SDGs: [{ type: Schema.Types.ObjectId, ref: 'SDG', required: true }],
    startDate: { type: Date },
    endDate: { type: Date, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    donations: [
      {
        amount: { type: Number, required: true },
        donator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
        commentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true },
)

export const Action = model<IAction>('Action', actionSchema)
