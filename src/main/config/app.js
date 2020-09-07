const app = require('fastify')()
const cors = require('../plugins/cors')

cors(app)

module.exports = app
