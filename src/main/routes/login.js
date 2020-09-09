const LoginRouter = require('../composers/LoginRouterComposer')
const FastifyRouterAdapter = require('../adapters/FastifyRouterAdapter')

module.exports = async (app, options, done) => {
  app.post('/login', FastifyRouterAdapter.adapt(LoginRouter))

  done()
}
