const cors = require('fastify-cors')

module.exports = (app) => {
  app.register(cors, {
    origin: '*',
    methods: '*',
    allowedHeaders: '*'
  })
}
