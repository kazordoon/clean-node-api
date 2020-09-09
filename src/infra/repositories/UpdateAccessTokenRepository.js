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

    const userModel = await mongoHelper.getCollection('users')

    await userModel.updateOne({ _id: userId }, {
      $set: {
        accessToken
      }
    })
  }
}

module.exports = UpdateAccessTokenRepository
