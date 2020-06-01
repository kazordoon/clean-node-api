const LoginRouter = require('./LoginRouter.js')
const MissingParamError = require('../helpers/MissingParamError')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
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
        password: 'mypass'
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
        email: 'myemail@mail.com'
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
        email: 'myemail@mail.com',
        password: 'mypass'
      }
    }
    SUT.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })
})
