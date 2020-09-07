const app = require('./app')

describe('App', () => {
  describe('GET /', () => {
    it('should return status code 200', async () => {
      app.get('/', (request, reply) => {
        return reply.code(200).send()
      })

      const response = await app.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.statusCode).toBe(200)
    })
  })
})
