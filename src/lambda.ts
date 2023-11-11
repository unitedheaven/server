import awsLambdaFastify from '@fastify/aws-lambda'
import server from './server'

exports.handler = awsLambdaFastify(server)
