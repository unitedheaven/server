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
  SDGs: z.array(z.number()).min(1),
})

export const zodActionResponse = z
  .object({
    actionId: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    location: z
      .object({
        lat: z.string(),
        lng: z.string(),
      })
      .or(z.string()),
    startDate: z.string().optional(),
    endDate: z.string(),
    SDGs: z.array(z.number()).min(1),
    creator: z.object({
      userId: z.string(),
      username: z.string(),
    }),
    participants: z.array(
      z.object({
        userId: z.string(),
        username: z.string(),
      }),
    ),
    followers: z.array(
      z.object({
        userId: z.string(),
        username: z.string(),
      }),
    ),
    donations: z.array(
      z.object({
        amount: z.number(),
        donator: z.object({
          userId: z.string(),
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
          userId: z.string(),
          username: z.string(),
        }),
      }),
    ),
  })
  .or(z.string())
