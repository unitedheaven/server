import fsMultipart from '@fastify/multipart'

import { Action } from '@db/models/action.model'
import { IUser } from '@db/models/user.model'
import {
  zodActionInput,
  zodActionParams,
  zodActionResponse,
  zodActionFollowOrParticipateResponse,
} from '@validations/action.validation'
import { zod404Error } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

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
      const returnedAction = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('participants')
        .populate('followers')
        .populate('donations')
        .populate('progress')
        .populate('comments')

      if (!returnedAction)
        return reply.status(404).send({ error: 'Action not found' })

      console.log(returnedAction)

      return returnedAction
    },
  )

  server.post(
    '/:id/follow',
    {
      schema: {
        params: zodActionParams,
        response: {
          200: zodActionFollowOrParticipateResponse,
          400: zod404Error,
          404: zod404Error,
        },
      },
    },

    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = 'd4300e5b-8acc-481f-8a48-c6aa1e6f7604'

      const actionToBeFollowed =
        await Action.findById(actionIdParams).populate('followers')

      if (!actionToBeFollowed)
        return reply.status(404).send({ error: 'Action not found' })

      if (actionToBeFollowed.creator.id == userId)
        return reply
          .status(400)
          .send({ error: "Creator can't follow his own action" })

      const isAlreadyFollowing = actionToBeFollowed.followers.some(follower => {
        return follower.id == userId
      })
      if (isAlreadyFollowing)
        return reply.status(400).send({ error: 'Already following' })

      actionToBeFollowed.followers.push(userId as unknown as IUser)
      const followedAction = await actionToBeFollowed.save()

      console.log(followedAction)

      return {
        success: true,
      }
    },
  )

  server.post(
    '/:id/participate',
    {
      schema: {
        params: zodActionParams,
        response: {
          200: zodActionFollowOrParticipateResponse,
          400: zod404Error,
          404: zod404Error,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = 'd4300e5b-8acc-481f-8a48-c6aa1e6f7604'

      const actionToBeParticipated =
        await Action.findById(actionIdParams).populate('participants')

      console.log(actionToBeParticipated)

      if (!actionToBeParticipated)
        return reply.status(404).send({ error: 'Action not found' })

      const isAlreadyParticipated = actionToBeParticipated.participants.some(
        participant => {
          return participant.id == userId
        },
      )
      if (isAlreadyParticipated)
        return reply.status(400).send({ error: 'Already participated' })

      actionToBeParticipated.participants.push(userId as unknown as IUser)
      await actionToBeParticipated.save()

      return {
        success: true,
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
      const creator = 'daabba20-b705-41c9-9f3e-42659b8b140d'

      const postedAction = await new Action({
        ...request.body,
        creator,
      }).save()

      await postedAction.populate('creator')

      return postedAction
    },
  )
}
