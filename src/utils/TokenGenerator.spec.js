class TokenGenerator {
  async generate (id) {
    return null
  }
}

describe('TokenGenerator', () => {
  it('should return null if JWT returns null', async () => {
    const SUT = new TokenGenerator()
    const token = await SUT.generate('any_id')

    expect(token).toBeNull()
  })
})
