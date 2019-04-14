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

      /**
       * looks for an event set at the same date and time as the new event
       * being created
       */
      const event = await Event.query()
        .where({
          date,
          time
        }).fetch()

      const jsonEvent = event.toJSON()

      if (jsonEvent.length > 0) {
        return response
          .status(400)
          .send({ message: {
            error: `You can't create an event in the same date and time`
          } })
      }

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

      const event = await Event.query()
        .where({
          id: eventID,
          user_id: userID
        }).fetch()

      /**
       * As the fetched data comes within a serializer
       * we need to convert it to JSON so we are able
       * to work with the data retrieved
       *
       * Also, the data will be inside an array, as we
       * may have multiple results, we need to retrieve
       * the first value of the array
       */
      const jsonEvent = event.toJSON()[0]

      // checking if event belongs to user
      if (jsonEvent['user_id'] !== userID) {
        return response
          .status(401)
          .send({ message: {
            error: 'You are not allowed to delete this event'
          } })
      }

      // deleting event
      await Event.query()
        .where({
          id: eventID,
          user_id: userID
        }).delete()
    } catch (err) {
      if (err.status === 404) {
        return response.status(err.status)
          .send({ message: {
            error: 'Event not found'
          } })
      }
      console.log(err)
      return response.status(err.status).send(err)
    }
  }
}

module.exports = EventController
