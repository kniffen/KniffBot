async function time(
  message,
  state = require('../state.js'),
  moment = require('moment-timezone')
) {

  message.output = moment.tz(state.timezone).format(state.timeformat)
  message.isCode = true

  return message

}

module.exports = time