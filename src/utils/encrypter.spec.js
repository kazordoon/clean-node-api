const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  it('should return true if bcrypt returns true', async () => {
    const SUT = new Encrypter()

    const isValid = await SUT.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  it('should return false if bcrypt returns false', async () => {
    const SUT = new Encrypter()
    bcrypt.isValid = false
    const isValid = await SUT.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  it('should call bcrypt with correct values', async () => {
    const SUT = new Encrypter()

    await SUT.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
