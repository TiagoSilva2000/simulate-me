import App from './app'
import 'dotenv/config'

App.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
