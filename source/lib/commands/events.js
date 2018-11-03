async function events(
  message, 
  config = require('../../../config.json'),
  moment = require('moment-timezone'),
  getEvents = require('../utils/get-events.js')
) {

  const eventsArr = await getEvents()

  message.output = 'Upcoming events:\n'

  message.output += 
    eventsArr
      .filter(event => event.timestamp > message.timestamp)
      .map(event => `\n- ${moment(event.timestamp).tz(config.timezone).format(config.timeformat)}\n${event.name}\n${event.description || ''}`)
      .join('\n')

  message.isCode = true

  return message

}

module.exports = events