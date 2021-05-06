import DiscordJS from 'discord.js'

import { Command, Message } from '../types'

import settings from '../settings'
import discord from '../services/discord'
import commands from '../commands'

export default function createParsedMessage(
  serviceName: string,
  original: any
): Message {

  const message: Message = {
    service: serviceName,
    input: '',
    timestamp: Date.now(),
    author: {
      id: '',
      name: '',
      isAuthorized: false
    },
    isBot: false,
    isFile: false,
    isReply: false,
    isMentioned: false,
    original,
  }

  if ( serviceName === 'discord' ) {
    message.input = original.cleanContent
    message.timestamp = original.createdTimestamp
    message.author.id = original.author.id
    message.author.name = original.author.username
    message.isMentioned = original.mentions.users.find((user: any) => user.id == discord.user.id) ? true : false
    message.isBot = original.author.id == discord.user.id

  } else if ( serviceName === 'twitchIRC' ) {
    message.input = original.message
    message.timestamp = original.time || Date.now()
    message.author = {id: original.ident, name: original.nick, isAuthorized: false}
    message.isMentioned = message.input.includes(`@${process.env.TWITCH_IRC_USERNAME.toLowerCase()}`)
    message.isBot = original.ident.toLowerCase() === process.env.TWITCH_IRC_USERNAME.toLowerCase()

  }

  const prefix = settings.commandPrefix
  if ( message.input.substr(0, prefix.length) === prefix ) {
    const args = message.input.split(' ')
    const id = args.shift().substring(prefix.length).toLowerCase()
    
    if ( commands.find((command: Command) => command.id === id) ) {
      message.command = {id, args}
    }
  }

  return message

}
