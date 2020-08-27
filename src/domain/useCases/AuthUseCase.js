const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (LoadUserByEmailRepository) {
    this.loadUserByEmailRepository = LoadUserByEmailRepository
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

    return null
  }
}

module.exports = AuthUseCase
