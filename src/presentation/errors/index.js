const InternalServerError = require('./InternalServerError')
const InvalidParamError = require('./InvalidParamError')
const MissingParamError = require('./MissingParamError')
const UnauthorizedError = require('./UnauthorizedError')

module.exports = {
  InternalServerError,
  InvalidParamError,
  MissingParamError,
  UnauthorizedError
}
