function disconnected(
  serviceID, 
  log = console.log,
  env = process.env,
  services = require('../services.js')
) {

  log(`${serviceID} disconnected`)

  if (serviceID == 'discord') services.discord.login(env.DISCORD_TOKEN)

}

module.exports = disconnected