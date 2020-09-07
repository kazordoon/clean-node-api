const app = require('fastify')()
const cors = require('fastify-cors')

app.register(cors, {
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
})

module.exports = app
