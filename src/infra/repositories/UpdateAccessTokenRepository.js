const { MissingParamError } = require('../../utils/errors')
const mongoHelper = require('../helpers/mongoHelper')

class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    const db = await mongoHelper.getDb()
    const userModel = db.collection('users')

    await userModel.updateOne({ _id: userId }, {
      $set: {
        accessToken
      }
    })
  }
}

module.exports = UpdateAccessTokenRepository
