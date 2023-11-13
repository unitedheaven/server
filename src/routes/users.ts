import fsMultipart from '@fastify/multipart'

import { User } from '@db/models/user.model'
import {
  zodUserInput,
  zodUserParams,
  zodUserResponse,
} from '@validations/user.validation'
import { zod404Error } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

export default async (server: FastifyZodInstance) => {
  server.register(userMultiPartRoutes)

  // ROUTE: to get a specific user
  server.get(
    '/:id',
    {
      schema: {
        params: zodUserParams,
        response: {
          200: zodUserResponse,
          404: zod404Error,
        },
      },
    },
    async (request, reply) => {
      const { id: userIdParams } = request.params
      const returnedUser = await User.findById(userIdParams)

      if (!returnedUser)
        return reply.status(404).send({ error: 'User not found' })

      const { _id, username, createdAt, updatedAt } = returnedUser

      return {
        userId: _id.toString(),
        username,
        createdAt,
        updatedAt,
      }
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

  // ROUTE: to create a new user
  server.post(
    '/',
    {
      schema: {
        consumes: ['multipart/form-data'],
        body: zodUserInput,
        response: {
          200: zodUserResponse,
        },
      },
    },
    async (request, reply) => {
      const returnedUser = await new User(request.body).save()

      const { _id, username } = returnedUser

      return reply.status(200).send({ userId: _id.toString(), username })
    },
  )
}
