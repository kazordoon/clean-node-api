class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmailRepository', () => {
  it('should return null if no user is found', async () => {
    const SUT = new LoadUserByEmailRepository()
    const user = await SUT.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })
})
