async function updateEvents(
  env = process.env,
  state = require('../state.js'),
  fetch = require('node-fetch'),
  date = Date
) {

  const url = `https://www.googleapis.com/calendar/v3/calendars/${env.GOOGLE_CALENDAR_ID}/events?singleEvents=true&orderBy=startTime&key=${env.GOOGLE_CALENDAR_APIKEY}`
  const list = await fetch(url).then(data => data.json())

  state.events = 
    list.items
      .filter((element, index) => index < 3)
      .map(event => {
        const d = new date(event.start.dateTime || event.start.date)
        
        return {
          timestamp: d.getTime(),
          name: event.summary,
          description: event.description,
          location: event.location
        }
      })

}

module.exports = updateEvents