import zod from '@plugins/zod'

import { FastifyZodInstance } from '@/types/fastify-zod'

import healthCheck from '@/routes/health-check'
import users from '@routes/users'

export default async (server: FastifyZodInstance) => {
  server.register(zod)

  server.register(users, { prefix: '/users' })
  server.register(healthCheck, { prefix: '/health-check' })
}
