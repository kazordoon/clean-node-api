const mongoHelper = require('../helpers/mongoHelper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./UpdateAccessTokenRepository')

let userModel
let fakeUserId
const fakeUser = {
  email: 'valid_email@mail.com'
}

const makeSUT = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessTokenRepository', () => {
  beforeEach(async () => {
    await userModel.deleteMany({})
    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    fakeUserId = insertedFakeUser._id
  })

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    userModel = await mongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const SUT = makeSUT()
    await SUT.update(fakeUserId, 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })

    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('should throw an error if no params are provided', async () => {
    const SUT = makeSUT()

    expect(SUT.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(SUT.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
