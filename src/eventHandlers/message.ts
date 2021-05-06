import settings from '../settings'
import commands from '../commands'
import discord from '../services/discord'
import cleverbot from '../services/cleverbot'
import createParsedMessage from '../utils/createParsedMessage'
import sendMessage from '../utils/sendMessage'

export default async function messageEventHandler(serviceName: string, data: any) {

  const message = createParsedMessage(serviceName, data)

  // Quit early if the message originates from a bot
  if (message.isBot) return

  // // Commands
  if ( message.command ) {
    const command = commands.find(command => command.id === message.command.id)

    if (!command) return

    let meetsArgRequirements: boolean = false
    for ( const args of command.args ) {
      if ( message.command.args.length >= args.length ) {
        meetsArgRequirements = true
        continue
      }
    }

    if ( !meetsArgRequirements ) {
      message.output = `Missing or incorrect arguments\nType \`${settings.commandPrefix}help ${command.id}\` for usage`
      message.isReply = true

      sendMessage(message)

      return
    }

    try {
      await command.run(message)
    } catch ( err ) {
      message.output = `Something went wrong 😱\n${err.message}`
    }

  }

  if ( message.isMentioned ) {
    let cleanInput = message.input.slice().replace(/<:\w+:\w+>/g, '').toLowerCase()
    let botUsername = ''

    switch ( serviceName ) {
      case 'discord':
        botUsername = discord.user.username.toLowerCase()
        break

      case 'twitchIRC':
        botUsername = process.env.TWITCH_IRC_USERNAME.toLowerCase()
        break
    }


    while ( cleanInput.includes(`@${botUsername}`) ) {
      cleanInput = cleanInput.replace(`@${botUsername}`, '')
      if (cleanInput[0] == ' ') cleanInput = cleanInput.substr(1)
    }

    message.isReply = true

    try {
      message.output = await new Promise(function(resolve) {
        cleverbot.write(cleanInput, function(answer: any) {
          resolve(answer.message)
        })
      })
    
    } catch (err) {
      message.output = "I'm sorry, can you repeat that?"
    
    }
  
  }

  if ( message.output )
    sendMessage(message)
}