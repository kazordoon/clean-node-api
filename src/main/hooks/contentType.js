module.exports = (app) => {
  app.addHook('onRequest', async (request, reply) => {
    reply.type('application/json')
  })
}
