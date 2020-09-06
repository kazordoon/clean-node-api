const mongoHelper = require('../helpers/mongoHelper')
const { MissingParamError } = require('../../utils/errors')

let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    await this.userModel.updateOne({ _id: userId }, {
      $set: {
        accessToken
      }
    })
  }
}

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

  beforeEach(async () => {
    await db.collection('users').deleteMany({})
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
    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    await SUT.update(insertedFakeUser._id, 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: insertedFakeUser._id })

    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('should throw an error if no userModel is provided', async () => {
    const userModel = db.collection('users')
    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    const SUT = new UpdateAccessTokenRepository()
    const promise = SUT.update(insertedFakeUser._id, 'any_accessToken')

    expect(promise).rejects.toThrow()
  })

  it('should throw an error if no params are provided', async () => {
    const { SUT, userModel } = makeSUT()

    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    expect(SUT.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(SUT.update(insertedFakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
