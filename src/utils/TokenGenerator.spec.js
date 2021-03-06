jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  sign (payload, secret) {
    this.payload = payload
    this.secret = secret

    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const { MissingParamError } = require('./errors')
const TokenGenerator = require('./TokenGenerator')

const makeSUT = () => {
  return new TokenGenerator('secret')
}

describe('TokenGenerator', () => {
  it('should return null if JWT returns null', async () => {
    const SUT = makeSUT()
    jwt.token = null
    const token = await SUT.generate('any_id')

    expect(token).toBeNull()
  })

  it('should return token if JWT returns token', async () => {
    const SUT = makeSUT()
    const token = await SUT.generate('any_id')

    expect(token).toBe(jwt.token)
  })

  it('should call JWT with correct values', async () => {
    const SUT = makeSUT()
    await SUT.generate('any_id')

    const payload = { _id: 'any_id' }
    expect(jwt.payload).toStrictEqual(payload)
    expect(jwt.secret).toBe(SUT.secret)
  })

  it('should throw an error if no secret is provided', async () => {
    const SUT = new TokenGenerator()
    const promise = SUT.generate('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('should throw an error if no id is provided', async () => {
    const SUT = makeSUT()
    const promise = SUT.generate()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
