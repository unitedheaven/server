import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { FastifyZodInstance } from '../types/fastify-zod'
import fsMultipart from '@fastify/multipart'

export default async (server: FastifyZodInstance) => {
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)
  server.withTypeProvider<ZodTypeProvider>()

  server.register(userMultiPartRoutes)

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
      return null
    },
  )
}

export const userMultiPartRoutes = async (server: FastifyZodInstance) => {
  server.register(fsMultipart, {
    attachFieldsToBody: 'keyValues',
    isPartAFile: (_fieldName, contentType, _fileName) => {
      return contentType != undefined && contentType.includes('image')
    },
  })

  server.post(
    '/',
    {
      schema: {
        consumes: ['multipart/form-data'],

        body: z.object({
          username: z.string(),
        }),

        response: {
          200: z.object({
            username: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { username } = request.body

      return reply.status(200).send({ username })
    },
  )
}
