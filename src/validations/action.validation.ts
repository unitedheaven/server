import { z } from 'zod'

export const zodActionParams = z.object({
  id: z.string(),
})

export const zodActionInput = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  location: z.string().optional(),
  onelineUrl: z.string().optional(),
  SDGs: z.array(z.string()).min(1),
  startDate: z.string().optional(),
  endDate: z.string(),
  isParticipatory: z.boolean(),
  isDonatable: z.boolean(),
  maxDonationAmount: z.number(),
  contractId: z.string(),
})

export const zodActionDonationInput = z.object({
  amount: z.number(),
})

export const zodActionWithdrawalInput = z.object({
  amount: z.number(),
  message: z.string(),
})

export const zodActionBooleanResponse = z.object({
  success: z.boolean(),
})

export const zodActionResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  location: z.string().optional(),
  onlineUrl: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date(),
  SDGs: z.array(z.string()).min(1),
  isParticipatory: z.boolean(),
  isDonatable: z.boolean(),
  maxDonationAmount: z.number(),
  contractId: z.string(),
  creator: z.object({
    id: z.string(),
    username: z.string(),
  }),
  participants: z.array(
    z.object({
      id: z.string(),
      username: z.string(),
    }),
  ),
  followers: z.array(
    z.object({
      id: z.string(),
      username: z.string(),
    }),
  ),
  donations: z.array(
    z.object({
      amount: z.number(),
      donator: z.object({
        id: z.string(),
        username: z.string(),
      }),
      date: z.date().optional(),
    }),
  ),
  withdrawals: z.array(
    z.object({
      amount: z.number(),
      message: z.string(),
      date: z.date().optional(),
    }),
  ),
  progress: z.array(
    z.object({
      message: z.string(),
      date: z.date().optional(),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
  currentContractValue: z.number(),
  totalDonationAmount: z.number(),
  totalParticipantCount: z.number(),
  totalFollowerCount: z.number(),
  isFollowing: z.boolean(),
  isParticipating: z.boolean(),
  isDonated: z.boolean(),
})

export type ActionResponseType = z.infer<typeof zodActionResponse>
