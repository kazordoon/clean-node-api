const { MongoClient } = require('mongodb')

let client
let db

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

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
    await userModel.insertOne(fakeUser)

    const user = await SUT.load('valid_email@mail.com')

    expect(user.email).toBe('valid_email@mail.com')
  })
})
