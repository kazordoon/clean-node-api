const LoginRouter = require('./LoginRouter.js')
const MissingParamError = require('../errors/MissingParamError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const InternalServerError = require('../errors/InternalServerError')
const InvalidParamError = require('../errors/InvalidParamError')

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  return authUseCaseSpy
}

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()

  const SUT = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    authUseCaseSpy,
    emailValidatorSpy,
    SUT
  }
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email

      return this.isAValidEmail
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isAValidEmail = true

  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidator {
    isValid (email) {
      throw new Error()
    }
  }

  return new EmailValidator()
}

describe('Login router', () => {
  it('should return status code 400 if no email is provided', async () => {
    const { SUT } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return status code 400 if no password is provided', async () => {
    const { SUT } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return status code 500 if no httpRequest is provided', async () => {
    const { SUT } = makeSut()

    const httpResponse = await SUT.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  it('should return status code 500 if no httpRequest has no body', async () => {
    const { SUT } = makeSut()

    const httpRequest = {}
    const httpResponse = await SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  it('should call AuthUseCase with correct params', async () => {
    const { SUT, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await SUT.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })

  it(
    'should return status code 401 when invalid credentials are provided',
    async () => {
      const { SUT, authUseCaseSpy } = makeSut()
      authUseCaseSpy.accessToken = null

      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'invalid_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body).toEqual(new UnauthorizedError())
    }
  )

  it(
    'should return status code 500 if no AuthUseCase is provided',
    async () => {
      const SUT = new LoginRouter()

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it(
    'should return status code 500 if AuthUseCase has no auth method',
    async () => {
      class AuthUseCaseSpy {}

      const authUseCaseSpy = new AuthUseCaseSpy()
      const SUT = new LoginRouter(authUseCaseSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it(
    'should return status code 200 if valid credentials are provided',
    async () => {
      const { SUT, authUseCaseSpy } = makeSut()

      const httpRequest = {
        body: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
    }
  )

  it(
    'should return status code 500 if AuthUseCase throws an error',
    async () => {
      const authUseCaseSpy = makeAuthUseCaseWithError()
      const SUT = new LoginRouter(authUseCaseSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it('should return status code 400 if an invalid email is provided', async () => {
    const { SUT, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isAValidEmail = false

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it(
    'should return status code 500 if no EmailValidator is provided',
    async () => {
      const authUseCaseSpy = makeAuthUseCase()
      const SUT = new LoginRouter(authUseCaseSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it(
    'should return status code 500 if EmailValidator has no isValid method',
    async () => {
      class EmailValidator {}

      const emailValidatorSpy = new EmailValidator()
      const authUseCaseSpy = makeAuthUseCase()
      const SUT = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it(
    'should return status code 500 if EmailValidator throws an error',
    async () => {
      const authUseCaseSpy = makeAuthUseCase()
      const emailValidatorSpy = makeEmailValidatorWithError()
      const SUT = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new InternalServerError())
    }
  )

  it('should call EmailValidator with correct email', async () => {
    const { SUT, emailValidatorSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await SUT.route(httpRequest)
    expect(emailValidatorSpy.isValid(httpRequest.body.email)).toBe(true)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
