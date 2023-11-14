import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'
import getSDGNumberToId from '@scripts/seed-data/sdgsNumberToIdMap.json'
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
  SDG: string
  name: string
  rating: string
  link: string
  score: string
}

export const seedCharities = async (
  numberToIdMap: Map<string, string>,
): Promise<void> => {
  const charities: Charity[] = []

  fs.createReadStream('./src/scripts/seed-data/charity.csv')
    .pipe(csv())
    .on('data', async (lineData: LineData) => {
      let charityAlreadyExists = false

      for (const charity of charities) {
        if (charity.name == lineData.name) {
          charityAlreadyExists = true
          const sdgIdInNumber = parseInt(lineData.SDG) + 1
          const sdgId = numberToIdMap.get(sdgIdInNumber.toString())
          if (sdgId) charity.SDGs.push(sdgId)
        }
      }
      if (!charityAlreadyExists) {
        const sdgIdInNumber = parseInt(lineData.SDG) + 1
        const sdgId = numberToIdMap.get(sdgIdInNumber.toString())
        const sdgs = sdgId ? [sdgId] : []
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
  const numberToIdMap = new Map<string, string>()
  for (const [key, value] of Object.entries(getSDGNumberToId)) {
    numberToIdMap.set(key, value)
  }

  console.log(numberToIdMap)
  await seedCharities(numberToIdMap)
}

main()
