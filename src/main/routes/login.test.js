const bcrypt = require('bcrypt')
const mongoHelper = require('../../infra/helpers/mongoHelper')
const app = require('../config/app')

let userModel

describe('Login Routes', () => {
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

  describe('POST /api/login', () => {
    it('should return status code 200 when valid credentials are provided', async () => {
      const password = 'hashed_password'
      const hashedPassword = await bcrypt.hash(password, 10)
      const fakeUser = {
        email: 'valid_email@mail.com',
        password: hashedPassword
      }
      await userModel.insertOne(fakeUser)

      const response = await app.inject({
        method: 'POST',
        url: '/api/login',
        body: { ...fakeUser, password }
      })

      expect(response.statusCode).toBe(200)
    })
  })
})
