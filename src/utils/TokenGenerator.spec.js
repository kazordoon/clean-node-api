const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret_key')
  }
}

const makeSUT = () => {
  return new TokenGenerator()
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
})
