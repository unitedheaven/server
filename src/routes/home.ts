// import { SDG } from '@db/models/sdg.model'
import { Action } from '@db/models/action.model'
import { Charity } from '@db/models/charity.model'
import { News } from '@db/models/news.model'
import { Event } from '@db/models/event.model'
import { SDG } from '@db/models'

import { ActionResponseType } from '@validations/action.validation'
// import { zodSDGRelatedResponse } from '@validations/sdg.validation'
// import { zod4xxError } from '@validations/error.validation'

import { FastifyZodInstance } from '@/types/fastify-zod'

const tempUserId = '682fc9a2-dfda-4ace-95ee-5bbaced67518'

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

  server.get(
    '/suggested',
    {
      schema: {},
    },
    async (_request, _reply) => {
      const userId = tempUserId

      const actions = await Action.find({
        $or: [{ participants: userId }, { followers: userId }],
      }).populate('SDGs')

      const sdgMap = new Map<string, number>()

      actions.forEach(action => {
        action.SDGs.forEach(sdg => {
          // @ts-ignore
          if (sdgMap.has(sdg.id)) {
            // @ts-ignore
            sdgMap.set(sdg.id, sdgMap.get(sdg.id) + 1)
          } else {
            // @ts-ignore
            sdgMap.set(sdg.id, 1)
          }
        })
      })

      const sortedSdgs = Array.from(sdgMap.entries()).sort((a, b) => {
        return b[1] - a[1]
      })
      const top5Sdgs = sortedSdgs.slice(0, 5)
      const sdgIds = top5Sdgs.map(sdg => sdg[0])

      const sdgs = await SDG.find({ _id: { $in: sdgIds } })
      const otherSdgs = await SDG.find({ _id: { $nin: sdgIds } })

      const allSdgs = [...sdgs, ...otherSdgs].slice(0, 5)
      return allSdgs
    },
  )

  server.get(
    '/trending',
    {
      schema: {},
    },
    async (_request, _reply) => {
      // get all actions that were created in the last 3 days and sort them by the number of participants
      const returnedActions = await Action.find({})
        .populate('creator')
        .populate('participants')
        .populate('followers')
        .populate('withdrawals')
        .populate('progress')

      const sortedActions = returnedActions
        .sort((a, b) => b.totalParticipantCount() - a.totalParticipantCount())
        .slice(0, 5)

      const returnedSDGs = await SDG.find().populate('followers')

      const sortedSDGs = returnedSDGs
        .sort((a, b) => b.followers.length - a.followers.length)
        .slice(0, 5)

      return {
        actions: sortedActions,
        sdgs: sortedSDGs,
      }
    },
  )
}
