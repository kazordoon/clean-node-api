const fastify = require('fastify')()

fastify.get('/', (request, reply) => {
  return { hello: 'world' }
})

fastify.listen(3333)
