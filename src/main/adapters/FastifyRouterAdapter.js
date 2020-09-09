class FastifyRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }

      const httpResponse = await router.route(httpRequest)
      return res.code(httpResponse.statusCode).send(httpResponse.body)
    }
  }
}

module.exports = FastifyRouterAdapter
