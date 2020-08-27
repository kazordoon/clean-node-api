const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./AuthUseCase')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const SUT = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    SUT,
    loadUserByEmailRepositorySpy
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

  it('should throw an error if no LoadUserByEmailRepository is provided', async () => {
    const SUT = new AuthUseCase()
    const promise = SUT.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  it('should throw an error if LoadUserByEmailRepository has no load method', async () => {
    const SUT = new AuthUseCase({})
    const promise = SUT.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadUserByEmailRepository returns null', async () => {
    const { SUT } = makeSut()
    const accessToken = await SUT.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })
})
