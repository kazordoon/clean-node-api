const mongoHelper = require('../helpers/mongoHelper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./UpdateAccessTokenRepository')

let db
let userModel

const makeSUT = () => {
  return new UpdateAccessTokenRepository()
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
    userModel = db.collection('users')
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
