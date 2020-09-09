const LoginRouter = require('../../presentation/routes/LoginRouter')
const AuthUseCase = require('../../domain/useCases/AuthUseCase')
const EmailValidator = require('../../utils/EmailValidator')
const LoadUserByEmailRepository = require('../../infra/repositories/LoadUserByEmailRepository')
const UpdateAccessTokenRepository = require('../../infra/repositories/UpdateAccessTokenRepository')
const Encrypter = require('../../utils/Encrypter')
const TokenGenerator = require('../../utils/TokenGenerator')
const env = require('../config/env')

class LoginRouterComposer {
  static compose () {
    const emailValidator = new EmailValidator()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const encrypter = new Encrypter()
    const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypter,
      tokenGenerator
    })
    return new LoginRouter({ authUseCase, emailValidator })
  }
}

module.exports = LoginRouterComposer
