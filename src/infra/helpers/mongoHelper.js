const { MongoClient } = require('mongodb')

module.exports = {
  async connect (url) {
    this.url = url

    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.client.db()
  },
  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },
  async getCollection (name) {
    const clientNotConnected = !this.client || !this.client.isConnected()
    if (clientNotConnected) {
      await this.connect(this.url)
    }

    return this.db.collection(name)
  }
}
