function connected(
  serviceID, 
  env = process.env,
  log = console.log,
  services = require('../services.js')
) {
  
  log(`${serviceID} connected`)

  switch (serviceID) {    
    case 'twitchIRC':
      services.twitchIRC.channel(`#${env.TWITCH_CHANNEL}`).join()
      break
  }

}

module.exports = connected