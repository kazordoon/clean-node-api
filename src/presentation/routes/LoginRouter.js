const HttpResponse = require('../helpers/HttpResponse')
const MissingParamError = require('../errors/MissingParamError')
const InvalidParamError = require('../errors/InvalidParamError')

class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorized()
      }

      return HttpResponse.ok({ accessToken })
    } catch (err) {
      /* console.error(err) */
      return HttpResponse.internalServerError()
    }
  }
}

module.exports = LoginRouter
