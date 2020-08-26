class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  it('should return true if validator returns true', () => {
    const SUT = new EmailValidator()
    const isEmailValid = SUT.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })
})
