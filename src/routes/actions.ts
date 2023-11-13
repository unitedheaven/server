import fsMultipart from '@fastify/multipart'

import { FastifyZodInstance } from '@/types/fastify-zod'
import { Action } from '@db/models/action.model'
import {
  zodActionInput,
  zodActionParams,
  zodActionResponse,
} from '@validations/action.validation'
import { zod404Error } from '@validations/error.validation'

export default async (server: FastifyZodInstance) => {
  server.register(userMultiPartRoutes)

  server.get(
    '/:id',
    {
      schema: {
        params: zodActionParams,
        response: {
          200: zodActionResponse,
          404: zod404Error,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const returnedAction =
        await Action.findById(actionIdParams).populate('creator')

      if (!returnedAction)
        return reply.status(404).send({ error: 'Action not found' })

      return ''
    },
  )
}

// TODO: move this to a separate file
const userMultiPartRoutes = async (server: FastifyZodInstance) => {
  server.register(fsMultipart, {
    attachFieldsToBody: 'keyValues',
    isPartAFile: (_fieldName, contentType, _fileName) => {
      return contentType != undefined && contentType.includes('image')
    },
  })

  // ROUTE: to create a new action
  server.post(
    '/',
    {
      schema: {
        consumes: ['multipart/form-data'],
        body: zodActionInput,
        response: { 200: zodActionResponse },
      },
    },
    async (request, _reply) => {
      const creator = '65515ecded0b6e9ef8dd7e6f'

      const returnedAction = await new Action({
        ...request.body,
        creator,
      }).save()

      console.log(returnedAction)

      return ''
    },
  )
}
