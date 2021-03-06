const LoadUserByEmailRepository = require('./LoadUserByEmailRepository')
const mongoHelper = require('../helpers/mongoHelper')
const { MissingParamError } = require('../../utils/errors')

let userModel

const makeSUT = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmailRepository', () => {
  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    userModel = await mongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('should return null if no user is found', async () => {
    const SUT = makeSUT()
    const user = await SUT.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  it('should return an user if an user is found', async () => {
    const SUT = makeSUT()
    const fakeUser = {
      email: 'valid_email@mail.com'
    }
    const [insertedFakeUser] = (await userModel.insertOne(fakeUser)).ops

    const user = await SUT.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: insertedFakeUser._id,
      password: insertedFakeUser.password
    })
  })

  it('should throw an error if no email is provided', async () => {
    const SUT = makeSUT()
    const promise = SUT.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
