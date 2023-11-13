import { z } from 'zod'

export const zodUserResponse = z.object({
  id: z.string(),
  username: z.string(),
})

export const zodUserInput = z.object({
  username: z.string(),
})

export const zodUserParams = z.object({
  id: z.string(),
})
