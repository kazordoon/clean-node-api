const app = require('./app')

describe('App', () => {
  it('should enable CORS', async () => {
    app.options('/test_cors', (request, reply) => {
      return reply.code(200).send()
    })

    const response = await app.inject({
      method: 'OPTIONS',
      url: '/test_cors'
    })

    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })
})
