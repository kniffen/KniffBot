async function time(
  message,
  date = Date,
  state = require('../state.js'),
  moment = require('moment-timezone'),
  fetch = require('node-fetch')
) {

  if (!message.args.length) {
    message.output = moment.tz(state.timezone).format(state.timeformat)
  
  } else {
    const geopath = 'http://maps.googleapis.com/maps/api/geocode/json?address='+encodeURI(message.args.join(' ').replace(/&/g, ''))
    const { lat, lng } = (await fetch(geopath).then(res => res.json())).results[0].geometry.location
    const tzpath = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=0&sensor=false`
    const timezone = (await fetch(tzpath).then(res => res.json())).timeZoneId
    
    message.output = moment.tz(date.now(), timezone).format(state.timeformat) + ' ' + timezone
  }

  message.isCode = true

  return message

}

module.exports = time