import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fp from 'fastify-plugin'

export default fp((server, _opts, done) => {
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)
  server.withTypeProvider<ZodTypeProvider>()

  done()
})
