module.exports = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3333
}
