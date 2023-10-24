import 'dotenv/config'
import Fastify from 'fastify'

import * as constants from './utils/constants'

const app = Fastify({
  logger: true,
})

app.get('/health-check', async () => {
  return { status: 'ok' }
})

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: constants.PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
