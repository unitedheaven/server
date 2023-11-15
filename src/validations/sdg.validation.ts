import { z } from 'zod'

export const zodSDGResponse = z.object({
  id: z.string(),
  title: z.string(),
  facts: z.array(z.string()).optional(),
  isFollowing: z.boolean(),
})

export const zodManySDGResponse = z.array(zodSDGResponse.optional())

export const zodSDGParams = z.object({
  id: z.string(),
})

export const zodSDGBooleanResponse = z.object({
  success: z.boolean(),
})

export const zodSDGRelatedResponse = z.object({})

export const zodSDGRelatedTopicsResponse = z.object({
  news: z.array(
    z.object({
      title: z.string(),
      image: z.string(),
      date: z.string(),
      link: z.string(),
      SDGs: z.array(z.string()),
      id: z.string(),
    }),
  ),
  events: z.array(
    z.object({
      title: z.string(),
      image: z.string(),
      date: z.string(),
      location: z.string(),
      link: z.string(),
      SDGs: z.array(z.string()),
      id: z.string(),
    }),
  ),
  charities: z.array(
    z.object({
      name: z.string(),
      rating: z.number(),
      score: z.number(),
      link: z.string(),
      SDGs: z.array(z.string()),
      id: z.string(),
    }),
  ),
  actions: z.array(
    z.object({
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
      contractId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
})
