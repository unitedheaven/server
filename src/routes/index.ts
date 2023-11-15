import cors from '@fastify/cors'

import zod from '@plugins/zod'
import errorHandler from '@plugins/error-handler'

import health from '@routes/health'
import users from '@routes/users'
import actions from '@routes/actions'
import sdgs from '@routes/sdgs'
import home from '@routes/home'

import { FastifyZodInstance } from '@/types/fastify-zod'

export default async (server: FastifyZodInstance) => {
  server.register(zod)
  server.register(errorHandler)
  server.register(cors, {
    origin: [
      'localhost:*',
      'https://web-united-heaven.vercel.app/*',
      'https://united-heaven.org/',
    ],
  })

  server.register(users, { prefix: '/users' })
  server.register(actions, { prefix: '/actions' })
  server.register(sdgs, { prefix: '/sdgs' })
  server.register(home, { prefix: '/home' })
  server.register(health, { prefix: '/health' })
}
