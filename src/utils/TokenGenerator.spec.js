const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    return jwt.sign(id, this.secret)
  }
}

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

    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(SUT.secret)
  })
})
