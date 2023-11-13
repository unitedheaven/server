import { z } from 'zod'

export const zodActionParams = z.object({
  id: z.string(),
})

export const zodActionInput = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  location: z
    .object({
      lat: z.string(),
      lng: z.string(),
    })
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string(),
  SDGs: z.array(z.string()).min(1),
})

export const zodActionFollowOrParticipateResponse = z.object({
  success: z.boolean(),
})

export const zodActionResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  location: z
    .object({
      lat: z.string(),
      lng: z.string(),
    })
    .or(z.string()),
  startDate: z.date().optional(),
  endDate: z.date(),
  SDGs: z.array(z.string()).min(1),
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
    }),
  ),
  progress: z.array(
    z.object({
      image: z.string().optional(),
      description: z.string(),
    }),
  ),
  comments: z.array(
    z.object({
      comment: z.string(),
      commentor: z.object({
        id: z.string(),
        username: z.string(),
      }),
    }),
  ),
})
