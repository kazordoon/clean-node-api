const LoginRouter = require('./LoginRouter.js')
const MissingParamError = require('../helpers/MissingParamError')

const makeSut = () => {
  return new LoginRouter()
}

describe('Login router', () => {
  it('should return status code 400 if no email is provided', () => {
    const SUT = makeSut()
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
    const SUT = makeSut()
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
    const SUT = makeSut()

    const httpResponse = SUT.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return status code 500 if no httpRequest has no body', () => {
    const SUT = makeSut()

    const httpRequest = {}
    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
