import { z } from 'zod'

export const zodUserResponse = z.object({
  id: z.string(),
  username: z.string(),
  profilePicture: z.string().optional(),
})

export const zodUserInput = z.object({
  username: z.string(),
  profilePicture: z.string().optional(),
})

export const zodUserParams = z.object({
  id: z.string(),
})
