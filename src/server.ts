import 'dotenv/config'
import Fastify from 'fastify'

import users from './api/users'
import healthCheck from './api/health-check'

import * as constants from './utils/constants'

const server = Fastify()

server.register(users, { prefix: '/users' })
server.register(healthCheck, { prefix: '/health-check' })

if (require.main === module) {
  server.listen({ port: constants.PORT, host: '0.0.0.0' }, err => {
    if (err) {
      console.log(err)
    }

    console.log(`server listening on localhost:${constants.PORT}`)
  })
}

export default server
