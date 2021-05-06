import DiscordJS from "discord.js"

import { Message, Command } from '../types'
import settings from '../settings'

const helpCommand: Command = {
  id: 'help',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'utility',
  args: [[], ['command']],
  isRestricted: false,
  run
}

/* Export the help command before importing commands to ensure that the help command is part of commands
 * Confused? me too
 */
export default helpCommand

import commands from './'

async function run(message: Message) {

  const availableCommands = 
    commands.filter(cmd => cmd.allowedServices.includes(message.service))

  if ( availableCommands.length <= 0 )
    return

  const specifiedCommand =
    message.command.args.length > 0 ? commands.find(cmd => cmd.id === message.command.args[0].toString().toLowerCase()) : null

  if ( specifiedCommand ) {
    const usages = 
      specifiedCommand
        .args
        .map(subArgs => `\`${settings.commandPrefix}${specifiedCommand.id} <${subArgs.join(' ')}>\``)
        .join('\n')

    message.output = `Usages for \`${settings.commandPrefix}${specifiedCommand.id}\`\n${usages}` 
  
    return
  } 

  if ( message.service === 'discord' ) {
    message.output = new DiscordJS.MessageEmbed()

    message.output.setAuthor('🤖 Available bot commands')
    message.output.setColor(settings.discordEmbedColor)

    const categories =
      availableCommands
        .map(cmd => cmd.category)
        .reduce((cats, cat) => cats.includes(cat) ? cats : [...cats, cat], [])

    for (const category of categories) {
      const value =
        availableCommands
          .filter(cmd => cmd.category === category)
          .filter(cmd => !cmd.isRestricted || message.author.isAuthorized)
          .map(cmd => settings.commandPrefix + cmd.id)
          .join('\n')

      message.output.addField(category, value, true)
    }

  } else {
    message.output =
      availableCommands
        .map(cmd => settings.commandPrefix + cmd.id)
        .join(' ')
  }

}

