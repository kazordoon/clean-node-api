const MissingParamError = require('./MissingParamError')
const UnauthorizedError = require('./UnauthorizedError')

class HttpResponse {
  static ok () {
    return {
      statusCode: 200
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: 500
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

module.exports = HttpResponse
