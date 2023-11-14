import { z } from 'zod'

export const zod4xxError = z.object({
  error: z.string(),
})
