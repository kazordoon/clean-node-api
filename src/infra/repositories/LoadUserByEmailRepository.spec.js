const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./LoadUserByEmailRepository')

let client
let db

const makeSUT = () => {
  const userModel = db.collection('users')
  const SUT = new LoadUserByEmailRepository(userModel)
  return { SUT, userModel }
}

describe('LoadUserByEmailRepository', () => {
  beforeEach(async () => {
    await db.collection('users').deleteMany({})
  })

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await client.db()
  })

  afterAll(async () => {
    await client.close()
  })

  it('should return null if no user is found', async () => {
    const { SUT } = makeSUT()
    const user = await SUT.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  it('should return an user if an user is found', async () => {
    const { SUT, userModel } = makeSUT()
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
})
