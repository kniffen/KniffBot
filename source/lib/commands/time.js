async function time(
  message,
  config = require('../../../config.json'),
  moment = require('moment-timezone')
) {

  message.output = moment.tz(config.timezone).format(config.timeformat)
  message.isCode = true

  return message

}

module.exports = time