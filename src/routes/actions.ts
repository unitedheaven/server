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

const tempUserId = '682fc9a2-dfda-4ace-95ee-5bbaced67518'

export default async (server: FastifyZodInstance) => {
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
        isCreator: returnedAction.isCreatedByUser(userId),
      }
    },
  )

  server.post(
    '/',
    {
      schema: {
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
        isCreator: postedAction2.isCreatedByUser(userId),
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
    '/:id/unfollow',
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

      const actionToBeUnfollowed = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('followers')

      if (!actionToBeUnfollowed)
        return reply.status(404).send({ error: 'Action not found' })

      if (!actionToBeUnfollowed.isFollowedByUser(userId))
        return reply.status(400).send({ error: 'Already not following' })

      // remove a specific user from actionToBeUnfollowed.followers array by userId
      actionToBeUnfollowed.followers = actionToBeUnfollowed.followers.filter(
        follower => follower.id != userId,
      )

      await actionToBeUnfollowed.save()

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
    '/:id/unparticipate',
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

      const actionToBeUnparticipated = await Action.findById(actionIdParams)
        .populate('creator')
        .populate('participants')

      console.log(actionToBeUnparticipated)

      if (!actionToBeUnparticipated)
        return reply.status(404).send({ error: 'Action not found' })

      if (!actionToBeUnparticipated.isParticipatedByUser(userId))
        return reply.status(400).send({ error: 'Not already participated' })

      // remove a specific user from actionToBeUnparticipated.participants array by userId
      actionToBeUnparticipated.participants =
        actionToBeUnparticipated.participants.filter(
          participant => participant.id != userId,
        )
      await actionToBeUnparticipated.save()

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
