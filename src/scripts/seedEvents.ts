import 'dotenv/config'
import { connectToDB } from '@db/index'
import { Event } from '@db/models/event.model'
import eventsJson from '@scripts/seed-data/events.json'
import getSDGNumberToId from '@scripts/seed-data/sdgsNumberToIdMap.json'

interface Events {
  title: string
  image: string
  date: Date
  location: string
  link: string
  SDGs: string[]
}

export const seedEvents = async () => {
  const events: Events[] = []

  const numberToIdMap = new Map<string, string>()
  for (const [key, value] of Object.entries(getSDGNumberToId)) {
    numberToIdMap.set(key, value)
  }

  for (const singleNews of eventsJson) {
    const SDGs: string[] = []

    for (const goal of singleNews.goals) {
      const sdgId = numberToIdMap.get(goal)
      if (sdgId) SDGs.push(sdgId)
    }

    const { title, img, date, link, location } = singleNews

    events.push({
      title,
      image: img,
      date: new Date(date),
      location,
      link,
      SDGs,
    })
  }

  await connectToDB()
  console.log('Connected to DB')

  await Event.deleteMany({})
  console.log('Existing Events deleted')

  await Event.create(events)
  console.log('Events seeded')
}

seedEvents()
