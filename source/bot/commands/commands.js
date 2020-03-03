/**
  * Commands command
  * Outputs a list of available commands for the API the message originated from
  */

export const id       = "commands"
export const category = "info"
export const services = ["discord", "twitchIRC"]
export const args     = [[]]

import { RichEmbed } from "discord.js"

import commands from "./"

export default async function(message, bot) {

  const available = commands.filter(cmd => cmd.services.includes(message.service))

  if (available.length <= 0)
    return message

  if (message.service == "discord") {
    message.output = new RichEmbed()

    message.output.setAuthor("🤖 Available bot commands")
    message.output.setColor(bot.settings.color)

    const categories = available.map(cmd => cmd.category)
                                .reduce((cats, cat) => cats.includes(cat) ? cats : [...cats, cat], [])

    for (const category of  categories) {
      const value = available.filter(cmd => cmd.category == category)
                             .map(cmd => bot.settings.prefix+cmd.id)
                             .join('\n')

      message.output.addField(category, value, true)
    }

  } else {
    message.output = available.map(cmd => bot.settings.prefix+cmd.id)
                              .join(' ')
  }


  return message

}