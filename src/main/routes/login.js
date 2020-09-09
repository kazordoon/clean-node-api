const LoginRouterComposer = require('../composers/LoginRouterComposer')
const { adapt } = require('../adapters/FastifyRouterAdapter')

module.exports = async (app, options, done) => {
  const loginRouter = LoginRouterComposer.compose()
  app.post('/login', adapt(loginRouter))
  done()
}
