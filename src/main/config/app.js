const app = require('fastify')()
const setupApp = require('./setup')

setupApp(app)

module.exports = app
