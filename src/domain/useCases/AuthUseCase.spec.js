const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./AuthUseCase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncrypterSpy()
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGenerator()
  tokenGenerator.accessToken = 'any_token'
  return tokenGenerator
}

const makeTokenGeneratorWithError = () => {
  class TokenGenerator {
    generate () {
      throw new Error()
    }
  }

  return new TokenGenerator()
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()

  const SUT = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    SUT,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  }
}

describe('Auth UseCase', () => {
  it('should throw an error if no email is provided', async () => {
    const { SUT } = makeSut()
    const promise = SUT.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw an error if no password is provided', async () => {
    const { SUT } = makeSut()
    const promise = SUT.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call loadUserByEmailRepository with correct email', async () => {
    const email = 'any_email@mail.com'
    const { SUT, loadUserByEmailRepositorySpy } = makeSut()
    await SUT.auth(email, 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe(email)
  })

  it('should return null if an invalid email is provided', async () => {
    const { SUT, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await SUT.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  it('should return null if an invalid password is provided', async () => {
    const { SUT, encrypterSpy } = makeSut()

    encrypterSpy.isValid = false
    const accessToken = await SUT.auth('valid_email@mail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  it('should call Encrypter with correct values', async () => {
    const password = 'any_password'
    const { SUT, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await SUT.auth('valid_email@mail.com', password)

    expect(encrypterSpy.password).toBe(password)
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  it('should call TokenGenerator with correct userId', async () => {
    const password = 'valid_password'
    const { SUT, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await SUT.auth('valid_email@mail.com', password)

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('should return an access token if correct credentials are provided', async () => {
    const password = 'valid_password'
    const { SUT, tokenGeneratorSpy } = makeSut()
    const accessToken = await SUT.auth('valid_email@mail.com', password)

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  it('should throw an error if invalid dependencies are provided', async () => {
    const invalid = {}
    const SUTs = [
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null
      }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: invalid
      })
    ]

    SUTs.forEach((SUT) => {
      const promise = SUT.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    })
  })

  it('should throw an error if any dependency throws an error', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const SUTs = [
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    ]
    SUTs.forEach((SUT) => {
      const promise = SUT.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    })
  })
})
