async function commandsCmd(message, commands = require('../commands.js')) {
  
  message.output = Object.keys(commands).map(key => `!${key}`).join(' ')
  message.isCode = true

  return message

}

module.exports = commandsCmd