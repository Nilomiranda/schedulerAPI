'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPasswordRecoveryTokenSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.timestamp('token_created_at') // date when token was created
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserPasswordRecoveryTokenSchema
