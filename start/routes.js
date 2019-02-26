'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store') // user signup
Route.get('users', 'SessionController.store') // user login

/**
 * routes only for authenticated users
 */

Route.group(() => {
  // updating username and password
  Route.put('users/:id', 'UpdateUserInfoController.update')
}).middleware(['auth'])
