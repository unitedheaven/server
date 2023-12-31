import { User } from '@db/models/user.model'
import {
  zodUserInput,
  zodUserParams,
  zodUserResponse,
} from '@validations/user.validation'
import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

export default async (server: FastifyZodInstance) => {
  server.get(
    '/:id',
    {
      schema: {
        params: zodUserParams,
        response: {
          200: zodUserResponse,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: userIdParams } = request.params
      const returnedUser = await User.findById(userIdParams)

      if (!returnedUser)
        return reply.status(404).send({ error: 'User not found' })

      return returnedUser
    },
  )

  server.post(
    '/',
    {
      schema: {
        body: zodUserInput,
        response: {
          200: zodUserResponse,
        },
      },
    },
    async (request, reply) => {
      const postedUser = await new User(request.body).save()

      return reply.status(200).send(postedUser)
    },
  )
}
