const routes = require('../routes')

module.exports = (app) => {
  routes.forEach((route) => {
    app.register(route, { prefix: '/api' })
  })
}
