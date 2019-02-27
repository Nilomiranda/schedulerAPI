'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')

const crypto = require('crypto')

class ForgotPasswordController {
  /**
   * this method will store a new request made by the user
   * when he requires a password recover it'll generate a
   * token to allow him to reset his password
   */
  async store ({ request, response }) {
    try {
      // account request password recovery
      const { email } = request.only(['email'])

      // checking if email is registered
      const user = await User.findByOrFail('email', email)

      // generating token
      const token = await crypto.randomBytes(10).toString('hex')

      // registeging when token was created and saving token
      user.token_created_at = new Date()
      user.token = token

      // persisting data (saving)
      await user.save()

      await Mail.send('emails.recover', { user, token }, (message) => {
        message
          .from('support@danmiranda.io')
          .to(email)
      })

      return user
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = ForgotPasswordController
