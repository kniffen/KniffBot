import DiscordJS from 'discord.js'

import errorEventHandler from '../eventHandlers/error'
import connectedEventHandler from '../eventHandlers/connected'
import disconnectedEventHandler from '../eventHandlers/disconnected'
import messageEventHandler from '../eventHandlers/message'

let discord: DiscordJS.Client

if ( process.env.DISCORD_TOKEN ) {
  discord = new DiscordJS.Client()

  discord.on('error', (error: Error) => errorEventHandler('discord', error))  
  discord.on('ready', () => connectedEventHandler('discord'))
  discord.on('disconnected', () => disconnectedEventHandler('discord'))  
  discord.on('message', (data: DiscordJS.Message)  => messageEventHandler('discord', data))

} else {
  throw new Error('Discord: Missing token')

}

export default discord