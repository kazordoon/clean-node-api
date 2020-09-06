const app = require('fastify')()

app.get('/', (request, reply) => {
  return { hello: 'world' }
})

module.exports = app
