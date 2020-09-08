const cors = require('../plugins/cors')
const contentType = require('../hooks/contentType')

module.exports = (app) => {
  cors(app)
  contentType(app)
}
