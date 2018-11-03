async function chatMessage(
  serviceID,
  data,
  { cleverbot } = require('../services.js'),
  commands = require('../commands.js'),
  parseMessage = require('../utils/parse-message.js'),
  sendMessage = require('../utils/send-message.js')
) {

  let message = parseMessage(serviceID, data)

  if (message.command && commands[message.command]) {
    switch (typeof commands[message.command]) {
      case 'string':
        message.output = commands[message.command]
        break

      case 'function':
        message = await commands[message.command](message)
        break
    }
  } else if (message.input.toLowerCase().includes(`@${message.self.username}`)) {
    const cleanInput = 
      message.input
        .split(' ')
        .filter(word => word.toLowerCase() != `@${message.self.username}`)
        .map(word => word.split('@').join(''))
        .join(' ')

    message.output = await new Promise(resolve => {
      cleverbot.write(cleanInput, answer => resolve(answer.message))
    })
    message.isReply = true
  }

  if (message.output) sendMessage(message)

}

module.exports = chatMessage