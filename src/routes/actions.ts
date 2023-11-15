import fsMultipart from '@fastify/multipart'

import { Action } from '@db/models/action.model'
import { IUser } from '@db/models/user.model'
import {
  zodActionInput,
  zodActionParams,
  zodActionResponse,
  zodActionDonationInput,
  zodActionWithdrawalInput,
  zodActionBooleanResponse,
} from '@validations/action.validation'
import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

const tempUserId = '3309a77c-4e91-4ed1-85b5-44f9d769cb9f'

export default async (server: FastifyZodInstance) => {
  server.register(userMultiPartRoutes)

  server.get(
    '/:id',
    {
      schema: {
        params: zodActionParams,
        response: {
          200: zodActionResponse,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = tempUserId

      const returnedAction = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('participants')
        .populate('followers')
        .populate('donations')
        .populate('withdrawals')
        .populate('progress')

      if (!returnedAction)
        return reply.status(404).send({ error: 'Action not found' })

      // console.log(returnedAction)

      const leanResult = returnedAction.toObject()

      return {
        ...leanResult,
        donations: [],
        currentContractValue: returnedAction.currentContractValue(),
        totalDonationAmount: returnedAction.totalDonationAmount(),
        totalParticipantCount: returnedAction.totalParticipantCount(),
        totalFollowerCount: returnedAction.totalFollowerCount(),
        isFollowing: returnedAction.isFollowedByUser(userId),
        isParticipating: returnedAction.isParticipatedByUser(userId),
        isDonated: returnedAction.isDonatedByUser(userId),
      }
    },
  )

  server.post(
    '/:id/follow',
    {
      schema: {
        params: zodActionParams,
        response: {
          200: zodActionBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },

    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = tempUserId

      const actionToBeFollowed = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('followers')

      if (!actionToBeFollowed)
        return reply.status(404).send({ error: 'Action not found' })

      if (actionToBeFollowed.creator.id == userId)
        return reply
          .status(400)
          .send({ error: "Creator can't follow his own action" })

      if (actionToBeFollowed.isFollowedByUser(userId))
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
          200: zodActionBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = tempUserId

      const actionToBeParticipated = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('participants')

      console.log(actionToBeParticipated)

      if (!actionToBeParticipated)
        return reply.status(404).send({ error: 'Action not found' })

      if (!actionToBeParticipated.isParticipatory)
        return reply.status(400).send({
          error: 'Action is not participatory',
        })

      if (actionToBeParticipated.creator.id == userId)
        return reply
          .status(400)
          .send({ error: "Creator can't participate in his own action" })

      if (actionToBeParticipated.isParticipatedByUser(userId))
        return reply.status(400).send({ error: 'Already participated' })

      actionToBeParticipated.participants.push(userId as unknown as IUser)
      await actionToBeParticipated.save()

      return {
        success: true,
      }
    },
  )

  server.post(
    '/:id/donate',
    {
      schema: {
        params: zodActionParams,
        body: zodActionDonationInput,
        response: {
          200: zodActionBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = tempUserId

      const { amount: donationAmountInput } = request.body

      const actionToBeDonated = await Action.findById(actionIdParams)
        .populate('donations')
        .populate('withdrawals')

      if (!actionToBeDonated)
        return reply.status(404).send({ error: 'Action not found' })

      if (!actionToBeDonated.isDonatable)
        return reply.status(400).send({
          error: 'Action is not donatable',
        })

      if (
        actionToBeDonated.currentContractValue() + donationAmountInput >
        actionToBeDonated.maxDonationAmount
      )
        return reply
          .status(400)
          .send({ error: 'Donation amount exceeds max donation amount' })

      actionToBeDonated.donations.push({
        amount: donationAmountInput,
        donator: userId as unknown as IUser,
      })
      await actionToBeDonated.save()

      return {
        success: true,
      }
    },
  )

  server.post(
    '/:id/withdraw',
    {
      schema: {
        params: zodActionParams,
        body: zodActionWithdrawalInput,
        response: {
          200: zodActionBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      // const userId = tempUserId

      const { amount: withdrawalAmountInput, message: withdrawalMessageInput } =
        request.body

      const actionToBeWithdrawn = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('donations')
        .populate('withdrawals')

      if (!actionToBeWithdrawn)
        return reply.status(404).send({ error: 'Action not found' })

      if (actionToBeWithdrawn.creator.id != tempUserId)
        return reply
          .status(403)
          .send({ error: 'Not authorized to withdraw from the contact' })

      console.log(actionToBeWithdrawn.currentContractValue())

      if (withdrawalAmountInput >= actionToBeWithdrawn.currentContractValue())
        return reply.status(400).send({
          error: 'Withdrawal amount exceeds donation amount',
        })

      actionToBeWithdrawn.withdrawals.push({
        amount: withdrawalAmountInput,
        message: withdrawalMessageInput,
      })
      await actionToBeWithdrawn.save()

      console.log(actionToBeWithdrawn)

      return {
        success: true,
      }
    },
  )

  server.post(
    '/:id/progress',
    {
      schema: {
        params: zodActionParams,
        body: zodActionWithdrawalInput,
        response: {
          200: zodActionBooleanResponse,
          400: zod4xxError,
          404: zod4xxError,
        },
      },
    },
    async (request, reply) => {
      const { id: actionIdParams } = request.params
      const userId = tempUserId

      const { message: progressMessageInput } = request.body

      const actionToBeProgressed = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('progress')

      if (!actionToBeProgressed)
        return reply.status(404).send({ error: 'Action not found' })

      if (actionToBeProgressed.creator.id != userId)
        return reply
          .status(403)
          .send({ error: 'Not authorized to update progress to the action' })

      actionToBeProgressed.progress.push({
        message: progressMessageInput,
      })
      await actionToBeProgressed.save()

      console.log(actionToBeProgressed)

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
      const userId = tempUserId

      const postedAction = await new Action({
        ...request.body,
        creator: userId,
      }).save()

      const postedAction2 = await postedAction.populate('creator')

      const leanResult = postedAction2.toObject()

      return {
        ...leanResult,
        currentContractValue: postedAction2.currentContractValue(),
        totalDonationAmount: postedAction2.totalDonationAmount(),
        totalParticipantCount: postedAction2.totalParticipantCount(),
        totalFollowerCount: postedAction2.totalFollowerCount(),
        isFollowing: postedAction2.isFollowedByUser(userId),
        isParticipating: postedAction2.isParticipatedByUser(userId),
        isDonated: postedAction2.isDonatedByUser(userId),
      }
    },
  )
}
