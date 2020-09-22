import fs from 'fs'
import parse from 'csv-parse/lib/sync'

export const getFileInfo = (populationFilePath: string): string[] => {
  const content = parse(
    fs.readFileSync(populationFilePath, { encoding: 'utf-8' }),
    {
      delimiter: ';'
    }
  )[0]

  return content
}
