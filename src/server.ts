import 'dotenv/config'
import Fastify from 'fastify'

import routes from '@/routes'
import { connectToDB } from '@db/index'
import * as constants from '@utils/constants'

const server = Fastify()

server.register(routes)

const main = async () => {
  try {
    await connectToDB()

    console.log('connected to database')
  } catch (error) {
    console.log(error)

    throw new Error(`Error connecting to database: ${error}`)
  }

  // if node runs locally, listen on localhost:PORT else export server for lambda
  if (require.main === module) {
    server.listen({ port: constants.PORT, host: '0.0.0.0' }, error => {
      if (error) {
        console.log(error)

        throw new Error(`Error connecting to database: ${error}`)
      }

      console.log(`server listening on localhost:${constants.PORT}`)
    })
  }
}

main()

export default server
