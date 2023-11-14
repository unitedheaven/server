import { SDG } from '@db/models/sdg.model'
import { IUser } from '@db/models/user.model'
import {
  zodSDGParams,
  zodSDGResponse,
  zodSDGBooleanResponse,
  zodManySDGResponse,
} from '@validations/sdg.validation'
import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

const tempUserId = '3309a77c-4e91-4ed1-85b5-44f9d769cb9f'

export default async (server: FastifyZodInstance) => {
  server.get(
    '/:id',
    {
      schema: {
        params: zodSDGParams,
        response: {
          200: zodSDGResponse,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: sdgIdParams } = request.params
      const userId = tempUserId

      const returnedSDG = await SDG.findById(sdgIdParams).populate('followers')

      if (!returnedSDG)
        return reply.status(404).send({ error: 'SDG not found' })

      console.log(returnedSDG)

      const leanResult = returnedSDG.toObject()

      return {
        ...leanResult,
        isFollowing: returnedSDG.isFollowedByUser(userId),
      }
    },
  )

  server.get(
    '/',
    {
      schema: {
        response: {
          200: zodManySDGResponse,
          404: zod4xxError,
        },
      },
    },
    async (_request, _reply) => {
      const userId = tempUserId

      const returnedSDGs = await SDG.find().populate('followers')

      console.log(returnedSDGs)

      const allSDGs: {
        id: string
        title: string
        facts?: string[]
        isFollowing: boolean
      }[] = []

      for (const sdg of returnedSDGs) {
        allSDGs.push({
          id: sdg.id,
          title: sdg.title,
          facts: sdg.facts,
          isFollowing: sdg.isFollowedByUser(userId),
        })
      }

      return allSDGs
    },
  )

  server.post(
    '/:id/follow',
    {
      schema: {
        params: zodSDGParams,
        response: {
          200: zodSDGBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },

    async (request, reply) => {
      const { id: sdgIdParams } = request.params
      const userId = tempUserId

      const sdgToBeFollowed =
        await SDG.findById(sdgIdParams).populate('followers')

      if (!sdgToBeFollowed)
        return reply.status(404).send({ error: 'SDG not found' })

      if (sdgToBeFollowed.isFollowedByUser(userId))
        return reply.status(400).send({ error: 'Already following' })

      sdgToBeFollowed.followers.push(userId as unknown as IUser)
      const followedAction = await sdgToBeFollowed.save()

      console.log(followedAction)

      return {
        success: true,
      }
    },
  )

  server.get(
    '/:id/related-topics',
    {
      schema: {
        params: zodSDGParams,
        response: {
          200: zodSDGResponse,
          404: zod4xxError,
        },
      },
    },
    async (request, _reply) => {
      const { id: sdgIdParams } = request.params

      console.log(sdgIdParams)

      // get actions, news, events, charities related to this SDG
    },
  )
}
