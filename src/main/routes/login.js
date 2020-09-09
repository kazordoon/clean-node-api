// const loginRouter = require('../composers/LoginRouterComposer')

module.exports = async (app, options, done) => {
  app.post('/login', (request, reply) => reply.send())

  done()
}
