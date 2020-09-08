const mongoHelper = require('../infra/helpers/mongoHelper')
const app = require('./config/app')

const env = require('./config/env')

mongoHelper.connect(env.MONGO_URL)
  .then(() => {
    app.listen(env.PORT, env.HOST)
  })
  .catch(console.error)
