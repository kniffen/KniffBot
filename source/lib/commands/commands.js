async function commands(message, state = require('../state.js')) {

  message.output = Object.keys(state.commands).map(key => `!${key}`).join(' ')
  message.isCode = true

  return message

}

module.exports = commands