async function nextEvent(
  message,
  getEvents = require('../utils/get-events.js')
) {

  const eventsArr = await getEvents()
  const events    = eventsArr.filter(event => event.timestamp >= message.timestamp)

  if (!events.length) {
    message.output = 'There are currently no scheduled events'
  
  } else {
    const remaining = Math.floor(events[0].timestamp - message.timestamp)

    const days = Math.floor(remaining / 1440)
    const hrs = Math.floor((remaining % 1440) / 60)
    const min = Math.floor((remaining % 1440) % 60)

    message.output = `${events[0].name} starts in ${days ? days+'d ' : ''}${hrs ? hrs+'h ' : ''}${min}m\n${events[0].description}\n${events[0].location}`

  }

  return message
}

module.exports = nextEvent