async function chatMessage(
  serviceID,
  data,
  { cleverbot } = require('../services.js'),
  state = require('../state.js'),
  parseMessage = require('../utils/parse-message.js'),
  sendMessage = require('../utils/send-message.js')
) {

  let message = parseMessage(serviceID, data)

  if (message.command && state.commands[message.command]) {
    switch (typeof state.commands[message.command]) {
      case 'string':
        message.output = state.commands[message.command]
        break

      case 'function':
        message = await state.commands[message.command](message)
        break
    }
  } else if (message.input.toLowerCase().includes(`@${state[serviceID].username}`)) {
    const cleanInput = 
      message.input
        .split(' ')
        .filter(word => word.toLowerCase() != `@${state[serviceID].username}`)
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