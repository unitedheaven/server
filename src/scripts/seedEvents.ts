import 'dotenv/config'
import { connectToDB } from '@db/index'
import { Event } from '@db/models/event.model'
import eventsJson from '@scripts/seed-data/events.json'

export const seedEvents = async () => {
  await connectToDB()
  console.log('Connected to DB')

  await Event.deleteMany({})
  console.log('Existing Events deleted')

  await Event.create(eventsJson)
  console.log('Events seeded')
}

seedEvents()
