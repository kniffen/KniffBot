function disconnected(
  serviceID, 
  log = console.log,
  env = process.env,
  services = require('../services.js'),
  state = require('../state.js')
) {

  log(`${serviceID} disconnected`)

  state[serviceID].online = false

  if (serviceID == 'discord') services.discord.login(env.DISCORD_TOKEN)

}

module.exports = disconnected