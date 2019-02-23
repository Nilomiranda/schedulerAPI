'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store') // user signup
Route.get('users', 'SessionController.store') // user login
