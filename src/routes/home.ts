// import { SDG } from '@db/models/sdg.model'
import { Action } from '@db/models/action.model'
import { Charity } from '@db/models/charity.model'
import { News } from '@db/models/news.model'
import { Event } from '@db/models/event.model'

import { ActionResponseType } from '@validations/action.validation'
// import { zodSDGRelatedResponse } from '@validations/sdg.validation'
// import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

const tempUserId = '3309a77c-4e91-4ed1-85b5-44f9d769cb9f'

export default async (server: FastifyZodInstance) => {
  server.get(
    '/feed',
    {
      schema: {},
    },
    async (_request, _reply) => {
      const sort = { createdAt: -1 }
      const limit = 30

      const newsPromise = News.find({}, undefined, {
        sort,
        limit,
      })
      const eventsPromise = Event.find({}, undefined, {
        sort,
        limit,
      })
      const actionsPromise = Action.find({}, undefined, {
        sort,
        limit,
      })
        .populate('creator')
        .populate('participants')
        .populate('followers')
        .populate('withdrawals')
        .populate('progress')

      const charitiesPromise = Charity.find({}, undefined, {
        sort,
        limit,
      })

      const [news, events, actions, charities] = await Promise.all([
        newsPromise,
        eventsPromise,
        actionsPromise,
        charitiesPromise,
      ])

      // loop through actions and add currentContractValue, totalDonationAmount, totalParticipantCount, totalFollowerCount, isFollowing, isParticipating
      const allActions: ActionResponseType[] = []

      actions.forEach(action => {
        const leanResult = action.toObject()
        allActions.push({
          ...leanResult,
          donations: [],
          currentContractValue: action.currentContractValue(),
          totalDonationAmount: action.totalDonationAmount(),
          totalParticipantCount: action.totalParticipantCount(),
          totalFollowerCount: action.totalFollowerCount(),
          isFollowing: action.isFollowedByUser(tempUserId),
          isParticipating: action.isParticipatedByUser(tempUserId),
          isDonated: action.isDonatedByUser(tempUserId),
        })
      })

      return {
        news,
        events,
        actions: allActions,
        charities,
      }
    },
  )
}
