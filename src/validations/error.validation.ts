import { z } from 'zod'

export const zod404Error = z.object({
  error: z.string(),
})
