import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { FastifyZodInstance } from '../types/fastify-zod'
import Pg from 'pg'

export default async (server: FastifyZodInstance) => {
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)
  server.withTypeProvider<ZodTypeProvider>()

  server.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof z.ZodError) {
      console.log(fromZodError(error).message)
      return reply.status(400).send(fromZodError(error))
    }

    console.log(error)

    return reply.status(500).send({ error: 'Internal Server Error' })
  })

  server.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (_request, _reply) => {
      const client: Pg.PoolClient = await server.pg.connect()

      // const { id: userId } = request.params

      const userResult = await client.query('SELECT * FROM user')

      return userResult
    },
  )
}
