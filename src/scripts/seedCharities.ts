import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'
import { connectToDB } from '@db/index'
import { Charity as CharityModel } from '@db/models/charity.model'

interface Charity {
  SDGs: string[]
  name: string
  rating: number
  link: string
  score: number
}

interface LineData {
  sdg: string
  name: string
  rating: string
  link: string
  score: string
}

export const seedCharities = async (): Promise<void> => {
  const charities: Charity[] = []

  fs.createReadStream('./src/scripts/seed-data/charity.csv')
    .pipe(csv())
    .on('data', async (lineData: LineData) => {
      let charityAlreadyExists = false

      for (const charity of charities) {
        if (charity.name == lineData.name) {
          charityAlreadyExists = true
          const sdgIdInNumber = parseInt(lineData.sdg) + 1
          charity.SDGs.push(sdgIdInNumber.toString())
        }
      }
      if (!charityAlreadyExists) {
        const sdgIdInNumber = parseInt(lineData.sdg) + 1
        const sdgs = [sdgIdInNumber.toString()]
        const { name, rating, link, score } = lineData
        charities.push({
          SDGs: sdgs,
          name,
          rating: parseInt(rating),
          link,
          score: parseFloat(score),
        })
      }
    })
    .on('end', async () => {
      await connectToDB()
      console.log('Connected to DB')

      await CharityModel.deleteMany({})
      console.log('Existing charities deleted')

      await CharityModel.create(charities)
      console.log('Charities seeded')
    })
}

const main = async () => {
  await seedCharities()
}

main()
