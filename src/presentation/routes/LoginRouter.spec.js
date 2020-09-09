const LoginRouter = require('./LoginRouter.js')
const {
  UnauthorizedError,
  InternalServerError
} = require('../errors')
const {
  MissingParamError,
  InvalidParamError
} = require('../../utils/errors')

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

const makeSUT = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()

  const SUT = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

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
    const { SUT } = makeSUT()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await SUT.route(httpRequest)

    const errorMessage = new MissingParamError('email').message

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(errorMessage)
  })

  it('should return status code 400 if no password is provided', async () => {
    const { SUT } = makeSUT()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await SUT.route(httpRequest)

    const errorMessage = new MissingParamError('password').message

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(errorMessage)
  })

  it('should return status code 500 if no httpRequest is provided', async () => {
    const { SUT } = makeSUT()
    const httpResponse = await SUT.route()
    const errorMessage = new InternalServerError().message

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(errorMessage)
  })

  it('should return status code 500 if no httpRequest has no body', async () => {
    const { SUT } = makeSUT()

    const httpRequest = {}
    const httpResponse = await SUT.route(httpRequest)

    const errorMessage = new InternalServerError().message

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(errorMessage)
  })

  it('should call AuthUseCase with correct params', async () => {
    const { SUT, authUseCaseSpy } = makeSUT()

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
      const { SUT, authUseCaseSpy } = makeSUT()
      authUseCaseSpy.accessToken = null

      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'invalid_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)

      const errorMessage = new UnauthorizedError().message

      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body.error).toBe(errorMessage)
    }
  )

  it(
    'should return status code 200 if valid credentials are provided',
    async () => {
      const { SUT, authUseCaseSpy } = makeSUT()

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

  it('should return status code 400 if an invalid email is provided', async () => {
    const { SUT, emailValidatorSpy } = makeSUT()
    emailValidatorSpy.isAValidEmail = false

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await SUT.route(httpRequest)

    const errorMessage = new InvalidParamError('email').message

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(errorMessage)
  })

  it('should call EmailValidator with correct email', async () => {
    const { SUT, emailValidatorSpy } = makeSUT()

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

  it('should throw an error if invalid dependencies are provided', async () => {
    const invalid = {}

    const authUseCase = makeAuthUseCase()

    const SUTs = [
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({ authUseCase: invalid }),
      new LoginRouter({ authUseCase }),
      new LoginRouter({ authUseCase, emailValidator: invalid })
    ]

    SUTs.forEach(async (SUT) => {
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new InternalServerError().message)
    })
  })

  it('should throw an error if any dependency throws an error', async () => {
    const authUseCase = makeAuthUseCase()

    const SUTs = [
      new LoginRouter({ authUseCase: makeAuthUseCaseWithError() }),
      new LoginRouter({
        authUseCase,
        emailValidator: makeEmailValidatorWithError()
      })
    ]

    SUTs.forEach(async (SUT) => {
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await SUT.route(httpRequest)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new InternalServerError().message)
    })
  })
})
