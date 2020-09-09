const { UnauthorizedError, InternalServerError } = require('../errors/')

class HttpResponse {
  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: {
        error: error.message
      }
    }
  }

  static internalServerError () {
    return {
      statusCode: 500,
      body: {
        error: (new InternalServerError()).message
      }
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: {
        error: (new UnauthorizedError()).message
      }
    }
  }
}

module.exports = HttpResponse
