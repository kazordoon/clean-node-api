module.exports = (app, options, done) => {
  app.get('/login', (request, reply) => {
    reply.send({ hello: 'world' })
  })

  done()
}
