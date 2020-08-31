const validator = require('validator')
const EmailValidator = require('./EmailValidator')
const { MissingParamError } = require('./errors')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  it('should return true if validator returns true', () => {
    const SUT = makeSut()
    const isEmailValid = SUT.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator returns false', () => {
    validator.isEmailValid = false
    const SUT = makeSut()
    const isEmailValid = SUT.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })

  it('should call validator with correct email', () => {
    const email = 'any_email@mail.com'
    const SUT = makeSut()
    SUT.isValid(email)

    expect(validator.email).toBe(email)
  })

  it('should throw an error if no email is provided', () => {
    const SUT = makeSut()

    expect(SUT.isValid).toThrow(new MissingParamError('email'))
  })
})
