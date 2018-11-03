function parseMessage(
  serviceID,
  data,
  env = process.env,
  services = require('../services.js')
) {
  
  let message

  switch (serviceID) {
    case 'discord':
      message = {
        serviceID,
        input: data.cleanContent,
        id: data.id,
        timestamp: data.createdTimestamp,
        author: data.author,
        fullMessage: data,
        self: {
          username: services.discord.user.username.toLowerCase()
        }
      }
      break

    case 'twitchIRC':
      message = {
        serviceID,
        input: data.message,
        author: {
          username: data.ident
        },
        timestamp: data.time,
        self: {
          username: env.TWITCH_IRC_USERNAME
        }
      }
      break
  }

  if (message.input[0] == '!') {
    message.args = message.input.split(' ')
    message.command = message.args[0].substring(1).toLowerCase()
    message.args.shift()
  }

  return message
}

module.exports = parseMessage