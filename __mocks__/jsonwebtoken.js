module.exports = {
  token: 'any_token',
  sign (id, secretKey) {
    return this.token
  }
}
