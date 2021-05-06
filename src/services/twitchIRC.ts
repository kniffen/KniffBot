const IRC = require('irc-framework')

import connectedEventHandler from '../eventHandlers/connected'
import messageEventHandler from '../eventHandlers/message'

let twitchIRC: any

if (
  process.env.TWITCH_IRC_USERNAME &&
  process.env.TWITCH_IRC_TOKEN &&
  process.env.TWITCH_CHANNEL
) {

  twitchIRC = new IRC.Client()

  twitchIRC.on('registered', () => connectedEventHandler('twitchIRC'))
  twitchIRC.on('message', (data: any) => messageEventHandler('twitchIRC', data))

} else {
  
  throw new Error('Missing Twitch IRC cedentials')

}

export default twitchIRC