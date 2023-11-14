import 'dotenv/config'
import { connectToDB } from '@db/index'
import { News } from '@db/models/news.model'
import newsJson from '@scripts/seed-data/news.json'

export const seedNews = async () => {
  await connectToDB()
  console.log('Connected to DB')

  await News.deleteMany({})
  console.log('Existing News deleted')

  await News.create(newsJson)
  console.log('News seeded')
}

seedNews()
