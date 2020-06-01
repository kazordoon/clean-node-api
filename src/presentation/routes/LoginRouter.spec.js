const LoginRouter = require('./LoginRouter.js')
const MissingParamError = require('../helpers/MissingParamError')
const UnauthorizedError = require('../helpers/UnauthorizedError')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  const SUT = new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    SUT
  }
}

describe('Login router', () => {
  it('should return status code 400 if no email is provided', () => {
    const { SUT } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return status code 400 if no password is provided', () => {
    const { SUT } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return status code 500 if no httpRequest is provided', () => {
    const { SUT } = makeSut()

    const httpResponse = SUT.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return status code 500 if no httpRequest has no body', () => {
    const { SUT } = makeSut()

    const httpRequest = {}
    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call AuthUseCase with correct params', () => {
    const { SUT, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    SUT.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })

  it(
    'should return status code 401 when invalid credentials are provided',
    () => {
      const { SUT, authUseCaseSpy } = makeSut()
      authUseCaseSpy.accessToken = null

      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'invalid_password'
        }
      }
      const httpResponse = SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body).toEqual(new UnauthorizedError())
    }
  )

  it(
    'should return status code 500 if no AuthUseCase is provided',
    () => {
      const SUT = new LoginRouter()

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  )

  it(
    'should return status code 500 if no AuthUseCase has no auth method',
    () => {
      class AuthUseCaseSpy {}

      const authUseCaseSpy = new AuthUseCaseSpy()
      const SUT = new LoginRouter(authUseCaseSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  )

  it(
    'should return status code 200 if valid credentials are provided',
    () => {
      const { SUT } = makeSut()

      const httpRequest = {
        body: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      }
      const httpResponse = SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
    }
  )
})
