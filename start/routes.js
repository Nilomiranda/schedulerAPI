'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store') // user signup
Route.get('users', 'SessionController.store') // user login

// recover password route
Route.post('users/forgotPassword', 'ForgotPasswordController.store')
Route.put('users/forgotPassword/:token/:email', 'ForgotPasswordController.update')

/**
 * routes only for authenticated users
 */
Route.group(() => {
  // updating username and password
  Route.put('users/:id', 'UpdateUserInfoController.update')

  // creating new Event
  Route.post('events/new', 'EventController.store')

  // listing all events
  Route.get('events/list', 'EventController.index')

  // listing events per date
  Route.get('events/list/date', 'EventController.show')

  // deleting event
  Route.delete('events/:id/delete', 'EventController.destroy')
}).middleware(['auth'])
