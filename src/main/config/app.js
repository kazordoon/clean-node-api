const app = require('fastify')()
const cors = require('../plugins/cors')
const contentType = require('../hooks/contentType')

cors(app)
contentType(app)

module.exports = app
