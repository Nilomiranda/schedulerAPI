'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.all()

      // attempting authentication
      const token = await auth.attempt(email, password)

      return token
    } catch (err) {
      response
        .status(err.status)
        .send({ message: { error: 'Incorrect credentials' } })
    }
  }
}

module.exports = SessionController
