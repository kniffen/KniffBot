/*
 * Help command
 * Outputs arguments available fro specified commands
 */

import commands from "./"

export const id           = "help"
export const category     = "utility"
export const services     = ["discord", "twitchIRC"]
export const args         = [["<command>"]]
export const isRestricted = false

export default async function helpCmd(message, bot) {

  const { prefix } = bot.data.settings

  if (message.command.args.length < 1) {
    message.output = `Missing arguments use. \`${prefix}${id} ${args.map(subArgs => subArgs.join(' ')).join(" or ")}\``
    return message
  }

  let cmdID = message.command.args[0].toLowerCase()
  cmdID     = cmdID.indexOf(prefix) == 0 ? cmdID.substring(prefix.length, cmdID.length) : cmdID 
  
  const command = commands.find(cmd => cmd.id == cmdID)
  const ids     = commands.map(cmd => cmd.id)

  if (!command) {
    message.output = `The command \`${prefix}${cmdID}\` does not exist.\nuse \`${prefix}commands\` to get a list of commands`
    return message
  }

  message.output = `Usages for \`${prefix}${command.id}\`\n` + 
                    command.args.map(subArgs => `\`${prefix}${command.id} ${subArgs.join(' ')}\``).join('\n')
  
  return message

}