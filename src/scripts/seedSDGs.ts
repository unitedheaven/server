import 'dotenv/config'
import { connectToDB } from '@db/index'
import { SDG } from '@db/models/sdg.model'
import data from '@scripts/seed-data/sdgs.json'

export const seedSDGs = async () => {
  await connectToDB()
  console.log('Connected to DB')

  await SDG.deleteMany({})
  console.log('Existing SDGs deleted')

  await SDG.create(data)
  console.log('SDGs seeded')
}

seedSDGs()
