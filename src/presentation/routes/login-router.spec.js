class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login router', () => {
  it('should return status code 400 if no email is provided', () => {
    // System Under Test
    const SUT = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'mypass'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return status code 400 if no password is provided', () => {
    // System Under Test
    const SUT = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'myemail@mail.com'
      }
    }

    const httpResponse = SUT.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
