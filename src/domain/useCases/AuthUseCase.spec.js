class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}

describe('Auth UseCase', () => {
  it('should throw an error if no email is provided', async () => {
    const SUT = new AuthUseCase()
    const promise = SUT.auth()

    expect(promise).rejects.toThrow()
  })
})
