import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import fp from 'fastify-plugin'

export default fp((server, _opts, done) => {
  server.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof ZodError) {
      console.log(fromZodError(error).message)
      return reply.status(400).send(fromZodError(error))
    }

    console.log(error)

    return reply.status(500).send({ error: 'Internal Server Error' })
  })

  done()
})
