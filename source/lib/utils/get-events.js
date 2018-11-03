async function getEvents(
  env = process.env,
  fetch = require('node-fetch'),
  date = Date
) {

  const url = `https://www.googleapis.com/calendar/v3/calendars/${env.GOOGLE_CALENDAR_ID}/events?singleEvents=true&orderBy=startTime&key=${env.GOOGLE_CALENDAR_APIKEY}`
  const list = await fetch(url).then(data => data.json())

  return list.items.map(event => {
    const d = new date(event.start.dateTime || event.start.date)
        
    return {
      timestamp: d.getTime(),
      name: event.summary,
      description: event.description,
      location: event.location
    }
  })

}

module.exports = getEvents