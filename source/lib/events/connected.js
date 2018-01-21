function connected(
  serviceID, 
  env = process.env,
  log = console.log,
  services = require('../services.js'),
  state = require('../state.js')
) {
  
  log(`${serviceID} connected`)

  state[serviceID].online = true

  switch (serviceID) {
    case 'discord':
      state.discord.username = services.discord.user.username.toLowerCase()
      break
    
    case 'twitchIRC':
      services.twitchIRC.channel(`#${env.TWITCH_CHANNEL}`).join()
      state.twitchIRC.username = env.TWITCH_IRC_USERNAME
      break
  }
}

module.exports = connected