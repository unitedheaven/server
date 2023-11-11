import mongoose from 'mongoose'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env. varialbe is not defined')
}

export default await mongoose.connect(process.env.DATABASE_URL)
