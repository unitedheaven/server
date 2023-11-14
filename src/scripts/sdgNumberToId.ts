import 'dotenv/config'
import { connectToDB } from '@db/index'
import { SDG } from '@db/models'
import fs from 'fs'

export const getSDGNumberToIdMap = async () => {
  const sdgsNumberToIdMap = new Map<string, string>()

  await connectToDB()
  console.log('Connected to DB')

  const returnedSDGs = await SDG.find()
  for (const sdg of returnedSDGs) {
    sdgsNumberToIdMap.set(sdg.number.toString(), sdg.id)
  }

  // store the file in seed-data/sdgsNumberToIdMap.json
  fs.writeFileSync(
    './src/scripts/seed-data/sdgsNumberToIdMap.json',
    JSON.stringify(Object.fromEntries(sdgsNumberToIdMap)),
  )

  console.log('SDGs number to id map created')
}

getSDGNumberToIdMap()
