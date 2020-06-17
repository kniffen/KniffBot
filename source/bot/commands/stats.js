/**
  * Stats command
  * Outputs various statistics about the bot
  *
  * TODO
  * - Replace formatTime() with a moment format call
  */

import DiscordJS from "discord.js"
import pkg from "../../../package.json"

export const id           = "stats"
export const category     = "utility"
export const services     = ["discord"]
export const args         = [[]]
export const isRestricted = true

export default async function(message, bot) {

  message.output = new DiscordJS.MessageEmbed()

  message.output.setTitle("🤖 Bot statistics")
  message.output.setURL(pkg.homepage)
  message.output.setColor(bot.data.settings.color)
  
  message.output.addField(pkg.name, 'v' + pkg.version)
  message.output.addField("Node",   process.version, true)

  const dependencies = [
    "discord.js",
    "irc-framework",
    "weather-js",
    "cleverbot-node",
    "node-wolfram-alpha",
    "moment-timezone"
  ]

  for (const item of dependencies) {
    message.output.addField(item, 'v'+pkg.dependencies[item].substr(1), true)
  }

  message.output.setFooter(`${pkg.license} License | Copyright (c) 2020 Kniffen`)


  return message

}