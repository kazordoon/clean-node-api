const bcrypt = require('bcrypt')
const Encrypter = require('./Encrypter')
const { MissingParamError } = require('./errors')

const makeSUT = () => {
  const encrypter = new Encrypter()
  return encrypter
}

describe('Encrypter', () => {
  it('should return true if bcrypt returns true', async () => {
    const SUT = makeSUT()

    const isValid = await SUT.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  it('should return false if bcrypt returns false', async () => {
    const SUT = makeSUT()
    bcrypt.isValid = false
    const isValid = await SUT.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  it('should call bcrypt with correct values', async () => {
    const SUT = makeSUT()

    await SUT.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })

  it('should throw an error if no params are provided', async () => {
    const SUT = makeSUT()

    expect(SUT.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(SUT.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
