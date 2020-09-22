import 'dotenv/config'

export const MongoURI = (): string => {
  let uri = ''

  if (!process.env.USERNAME && !process.env.PASSWORD) {
    uri += `mongodb://${process.env.HOST}:${process.env.DB_PORT}/`
    uri += `${process.env.DATABASE}`
  } else {
    uri += `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@`
    uri += `${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`
  }

  return uri
}
