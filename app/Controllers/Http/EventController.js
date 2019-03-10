'use strict'

const Event = use('App/Models/Event')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ response, auth }) {
    try {
      const userID = auth.user.id // logged user ID

      const events = await Event.query()
        .where({
          user_id: userID
        }).fetch()

      return events
    } catch (err) {
      return response.status(err.status)
    }
  }

  /**
   * Create/save a new event.
   * POST events
   */
  async store ({ request, response, auth }) {
    try {
      const { title, location, date, time } = request.all() // info for the event
      const userID = auth.user.id // retrieving user id current logged

      const newEvent = await Event.create({ user_id: userID, title, location, date, time })

      return newEvent
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: {
          error: 'Something went wrong while creating new event'
        } })
    }
  }

  async show ({ request, response, auth }) {
    try {
      const { date } = request.only(['date']) // desired date
      const userID = auth.user.id // logged user's ID

      // const event = await Event.findByOrFail('date', date)

      const event = await Event.query()
        .where({
          user_id: userID,
          date
        }).fetch()

      if (event.rows.length === 0) {
        return response
          .status(404)
          .send({ message: {
            error: 'No event found'
          } })
      }

      return event
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
          .status(err.status)
          .send({ message: {
            error: 'No event found'
          } })
      }

      console.log(err)
      return response.status(err.status)
    }
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   */
  async destroy ({ params, response, auth }) {
    try {
      const eventID = params.id // event's id to be deleted
      const userID = auth.user.id // logged user's ID

      const event = await Event.findByOrFail('id', eventID)

      // checking if event belongs to user
      if (event['user_id'] !== userID) {
        return response
          .status(401)
          .send({ message: {
            error: 'You are not allowed to delete this event'
          } })
      }

      // deleting event
      await event.delete()
    } catch (err) {
      if (err.status === 404) {
        return response.status(err.status)
          .send({ message: {
            error: 'Event not found'
          } })
      }
      return response.status(err.status).send(err)
    }
  }
}

module.exports = EventController
