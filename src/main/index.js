const mongoHelper = require('../infra/helpers/mongoHelper')
const fastify = require('fastify')({
  logger: true
})

const env = require('./config/env')

mongoHelper.connect(env.MONGO_URL)
  .then(() => {
    fastify.listen(env.PORT, env.HOST)
  })
  .catch(console.error)
