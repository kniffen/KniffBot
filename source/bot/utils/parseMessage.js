/**
  * Message parser
  * Parse messages from various APIs into a simplified and standerdized object structure
  */

import moment from "moment-timezone"

export default function parseMessage(service = '', original = {}, bot) {

  const message = {
    service,
    input:       '',
    timestamp:   0,
    isMentioned: false,
    isReply:     false,
    isBot:       false,
    isDM:        false,
    isOwner:     false,
    mentions:    [],
    author: {
      username: ''
    },
    self: {
      username: ''
    },
    original
  }

  if (!service || !original)
    return message

  if (service == "discord") {
    message.input      = original.cleanContent
    message.cleanInput = original.cleanContent.replace(/<:\w+:\w+>/g, '')
    message.timestamp  = original.createdTimestamp
    message.author     = original.author
    message.self       = {username: bot.discord.user.username}
    message.isDM       = original.channel.type == "dm"
    message.isOwner    = original.channel.type == "dm" || (original.member ? (original.member.guild.ownerID == original.member.user.id) : false)

    message.emojis = original.cleanContent.match(/<:\w+:\w+>/g)?.map(str => {
      const id    = str.replace(/<:\w+:|>/g, '')
      const name  = str.replace(/<:|:\w+>/g, '')
      const url   = `https://cdn.discordapp.com/emojis/${id}.png`

      return {string: str, id, name, url}
    }) || []

    if (original.mentions)
      message.mentions  = original.mentions.users.map(({ id, username }) => ({id, username}))

  } else if (service == "twitchIRC") {
    message.input     = original.message
    message.timestamp = original.time
    message.author    = {username: original.indet}
    message.self      = {username: process.env.TWITCH_IRC_USERNAME}

  } else {
    message.timestamp = moment.utc().format('x')
  }

  if ( message.author.username != '' 
    && message.self.username   != ''
    && message.author.username.toLowerCase() == message.self.username.toLowerCase()
  ) {
    message.isBot = true
  }

  if (message.input.toLowerCase().includes(`@${message.self.username.toLowerCase()}`))
    message.isMentioned = true

  if (message.input.substr(0, bot.data.settings.prefix.length) == bot.data.settings.prefix) {
    const args = message.input.split(' ')
    const id   = args.shift().substring(bot.data.settings.prefix.length).toLowerCase()
    
    message.command = {id, args}
  }

  return message

}