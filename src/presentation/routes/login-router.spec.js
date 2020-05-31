class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.internalServerError()
    }

    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
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
}

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login router', () => {
  it('should return status code 400 if no email is provided', () => {
    // System Under Test
    const SUT = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'mypass'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return status code 400 if no password is provided', () => {
    // System Under Test
    const SUT = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'myemail@mail.com'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return status code 500 if no httpRequest is provided', () => {
    // System Under Test
    const SUT = new LoginRouter()

    const httpResponse = SUT.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return status code 500 if no httpRequest has no body', () => {
    // System Under Test
    const SUT = new LoginRouter()

    const httpRequest = {}
    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
