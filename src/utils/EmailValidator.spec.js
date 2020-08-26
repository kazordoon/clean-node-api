const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  it('should return true if validator returns true', () => {
    const SUT = new EmailValidator()
    const isEmailValid = SUT.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator returns false', () => {
    validator.isEmailValid = false
    const SUT = new EmailValidator()
    const isEmailValid = SUT.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })
})
