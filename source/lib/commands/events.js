async function events(
  message, 
  state = require('../state.js'),
  moment = require('moment-timezone'),
  getEvents = require('../utils/get-events.js')
) {

  const eventsArr = await getEvents()

  message.output = 'Upcoming events:\n'

  message.output += 
    eventsArr
      .filter(event => event.timestamp > message.timestamp)
      .map(event => `\n- ${moment(event.timestamp).tz(state.timezone).format(state.timeformat)}\n${event.name}\n${event.description || ''}`)
      .join('\n')

  message.isCode = true

  return message

}

module.exports = events