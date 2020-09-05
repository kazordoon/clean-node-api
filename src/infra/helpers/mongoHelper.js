const { MongoClient } = require('mongodb')

module.exports = {
  async connect (url, dbName) {
    this.url = url
    this.dbName = dbName

    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.client.db(dbName)
  },
  async disconnect () {
    await this.client.close()
  },
  async getDb () {
    const clientNotConnected = !this.client.isConnected()
    if (clientNotConnected) {
      await this.connect(this.url, this.dbName)
    }

    return this.db
  }
}
