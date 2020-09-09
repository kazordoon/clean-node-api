const { MissingParamError } = require('../../utils/errors')
const mongoHelper = require('../helpers/mongoHelper')

class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const db = await mongoHelper.getDb()
    const userModel = db.collection('users')

    const user = await userModel.findOne({ email }, {
      projection: {
        password: 1
      }
    })
    return user
  }
}

module.exports = LoadUserByEmailRepository
