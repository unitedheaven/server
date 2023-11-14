import 'dotenv/config'
import { connectToDB } from '@db/index'
import { News } from '@db/models/news.model'
import newsJson from '@scripts/seed-data/news.json'
import getSDGNumberToId from '@scripts/seed-data/sdgsNumberToIdMap.json'

interface News {
  title: string
  image: string
  date: Date
  link: string
  SDGs: string[]
}

export const seedNews = async () => {
  const news: News[] = []

  const numberToIdMap = new Map<string, string>()
  for (const [key, value] of Object.entries(getSDGNumberToId)) {
    numberToIdMap.set(key, value)
  }

  for (const singleNews of newsJson) {
    const SDGs: string[] = []

    for (const goal of singleNews.goals) {
      const sdgId = numberToIdMap.get(goal)
      if (sdgId) SDGs.push(sdgId)
    }

    const { title, img, date, link } = singleNews

    news.push({ title, image: img, date: new Date(date), link, SDGs })
  }

  await connectToDB()
  console.log('Connected to DB')

  await News.deleteMany({})
  console.log('Existing News deleted')

  await News.create(news)
  console.log('News seeded')
}

seedNews()
