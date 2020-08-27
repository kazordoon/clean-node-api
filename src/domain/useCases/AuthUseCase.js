const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (LoadUserByEmailRepository, encrypter, tokenGenerator) {
    this.loadUserByEmailRepository = LoadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)

    if (!isValid) {
      return null
    }

    const token = await this.tokenGenerator.generate(user.id)
    return token
  }
}

module.exports = AuthUseCase
