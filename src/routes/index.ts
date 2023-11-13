import zod from '@plugins/zod'
import errorHandler from '@plugins/error-handler'

import health from '@routes/health'
import users from '@routes/users'
import actions from '@routes/actions'

import { FastifyZodInstance } from '@/types/fastify-zod'

export default async (server: FastifyZodInstance) => {
  server.register(zod)
  server.register(errorHandler)

  server.register(users, { prefix: '/users' })
  server.register(actions, { prefix: '/actions' })
  server.register(health, { prefix: '/health' })
}
