import { MongooseError, connect } from 'mongoose'

import { DATABASE_URL } from '@utils/constants'

export const connectToDB = async () => {
  try {
    if (!DATABASE_URL) {
      throw new MongooseError('DATABASE_URL env. variable is not defined')
    }
    return await connect(DATABASE_URL)
  } catch (error) {
    throw new Error(`Error connecting to database: ${error}`)
  }
}
