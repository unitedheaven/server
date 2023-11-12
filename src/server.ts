import 'dotenv/config'
import Fastify from 'fastify'

import * as constants from '@utils/constants'

import routes from '@/routes'

const server = Fastify()

server.register(routes)

// if node runs locally, listen on localhost:PORT else export server for lambda
if (require.main === module) {
  server.listen({ port: constants.PORT, host: '0.0.0.0' }, err => {
    if (err) {
      console.log(err)
    }

    console.log(`server listening on localhost:${constants.PORT}`)
  })
}

export default server
