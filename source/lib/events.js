const { discord, twitchIRC } = require('./services.js')

const eventHandlers = {
  error: require('./events/error.js'),
  connected: require('./events/connected.js'),
  disconnected: require('./events/disconnected.js'),
  chatMessage: require('./events/chat-message.js'),
}

if (discord) {
  discord.on('error', err => eventHandlers.error('Discord', err))
  discord.on('ready', () => eventHandlers.connected('discord'))
  discord.on('disconnected', () => eventHandlers.disconnected('discord'))
  discord.on('message', data => eventHandlers.chatMessage('discord', data))
}

if (twitchIRC) {
  twitchIRC.on('registered', () => eventHandlers.connected('twitchIRC'))
  twitchIRC.on('message', data => eventHandlers.chatMessage('twitchIRC', data))
}