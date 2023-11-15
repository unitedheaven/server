import { SDG } from '@db/models/sdg.model'
import { Action } from '@db/models/action.model'
import { Charity } from '@db/models/charity.model'
import { News } from '@db/models/news.model'
import { Event } from '@db/models/event.model'
import { IUser } from '@db/models/user.model'
import {
  zodSDGParams,
  zodSDGResponse,
  zodSDGBooleanResponse,
  zodManySDGResponse,
  zodSDGRelatedTopicsResponse,
} from '@validations/sdg.validation'
import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

const tempUserId = '682fc9a2-dfda-4ace-95ee-5bbaced67518'

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

  server.post(
    '/:id/unfollow',
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

      const sdgToBeUnfollowed =
        await SDG.findById(sdgIdParams).populate('followers')

      if (!sdgToBeUnfollowed)
        return reply.status(404).send({ error: 'SDG not found' })

      if (!sdgToBeUnfollowed.isFollowedByUser(userId))
        return reply.status(400).send({ error: 'Already not following' })

      sdgToBeUnfollowed.followers = sdgToBeUnfollowed.followers.filter(
        follower => follower.id !== userId,
      )
      const followedAction = await sdgToBeUnfollowed.save()

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
          200: zodSDGRelatedTopicsResponse,
          404: zod4xxError,
        },
      },
    },
    async (request, _reply) => {
      const { id: sdgIdParams } = request.params
      const limit = 5

      const newsPromise = News.find({ SDGs: sdgIdParams }, undefined, {
        limit,
      })
      const eventsPromise = Event.find({ SDGs: sdgIdParams }, undefined, {
        limit,
      })
      const actionsPromise = Action.find({ SDGs: sdgIdParams }, undefined, {
        limit,
      })
      const charitiesPromise = Charity.find({ SDGs: sdgIdParams }, undefined, {
        limit,
      })

      const [news, events, actions, charities] = await Promise.all([
        newsPromise,
        eventsPromise,
        actionsPromise,
        charitiesPromise,
      ])

      return {
        news,
        events,
        actions,
        charities,
      }
    },
  )
}
