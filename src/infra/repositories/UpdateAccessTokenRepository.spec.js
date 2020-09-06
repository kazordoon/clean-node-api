const mongoHelper = require('../helpers/mongoHelper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./UpdateAccessTokenRepository')

let db

const makeSUT = () => {
  const userModel = db.collection('users')
  const SUT = new UpdateAccessTokenRepository(userModel)

  return {
    userModel,
    SUT
  }
}

describe('UpdateAccessTokenRepository', () => {
  const fakeUser = {
    email: 'valid_email@mail.com'
  }
  let fakeUserId

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany({})
    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    fakeUserId = insertedFakeUser._id
  })

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    db = await mongoHelper.getDb()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const { SUT, userModel } = makeSUT()
    await SUT.update(fakeUserId, 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })

    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('should throw an error if no userModel is provided', async () => {
    const SUT = new UpdateAccessTokenRepository()
    const promise = SUT.update(fakeUserId, 'any_accessToken')

    expect(promise).rejects.toThrow()
  })

  it('should throw an error if no params are provided', async () => {
    const { SUT } = makeSUT()

    expect(SUT.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(SUT.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
