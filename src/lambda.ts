import awsLambdaFastify from '@fastify/aws-lambda'
import server from './server'

export default awsLambdaFastify(server)
