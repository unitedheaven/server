import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'

import { FastifyZodInstance } from '../types/fastify-zod'

export default async (server: FastifyZodInstance) => {
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)
  server.withTypeProvider<ZodTypeProvider>()

  server.get(
    '/',
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async () => {
      return { status: 'ok' }
    },
  )
}
