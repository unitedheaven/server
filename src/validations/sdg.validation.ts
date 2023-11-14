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
