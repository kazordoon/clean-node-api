const mongoHelper = require('./mongoHelper')

describe('mongoHelper', () => {
  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should reconnect when getCollection() is invoked and client is disconnected', async () => {
    const SUT = mongoHelper
    await SUT.connect(process.env.MONGO_URL)
    expect(SUT.db).toBeTruthy()

    await SUT.disconnect()
    expect(SUT.db).toBeFalsy()

    await SUT.getCollection('fake_name')
    expect(SUT.db).toBeTruthy()
  })
})
