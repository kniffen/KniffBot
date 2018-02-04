async function nextEvent(
  message, 
  state = require('../state.js'),
  updateEvents = require('../utils/update-events.js')
) {

  await updateEvents()

  if (!state.events.length) {
    message.output = 'There are currently no scheduled events'
  
  } else {
    const event = state.events[0]
    const remaining = Math.floor((event.timestamp - message.timestamp) / 60000)

    const days = Math.floor(remaining / 1440)
    const hrs = Math.floor((remaining % 1440) /60)
    const min = Math.floor((remaining % 1440) % 60)

    message.output = `${event.name} starts in ${days ? days+'d ' : ''}${hrs ? hrs+'h ' : ''}${min}m\n${event.description}\n${event.location}`

  }

  return message
}

module.exports = nextEvent