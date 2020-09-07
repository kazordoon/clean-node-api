const app = require('../config/app')

describe('Content-Type', () => {
  app.get('/test_content_type_json', (request, reply) => {
    return reply.send({})
  })

  app.get('/test_content_type_xml', (request, reply) => {
    reply.type('application/xml')
    return reply.send('')
  })

  it('should return JSON content-type as default', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test_content_type_json'
    })

    expect(response.headers['content-type']).toMatch(/json/)
  })

  it('should return XML content-type if forced', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test_content_type_xml'
    })

    expect(response.headers['content-type']).toMatch(/xml/)
  })
})
