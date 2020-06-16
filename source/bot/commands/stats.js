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

function formatTime(input) {
  const dd = i => i < 10 ? '0'+i : i
  const d = Math.floor(input / 86400)
  const h = Math.floor(input % 86400 / 3600)
  const m = Math.floor(input % 86400 % 3600 / 60)
  const s = Math.floor(input % 86400 % 3600 % 60)

  return d > 0 ? `${d} days ${dd(h)}:${dd(m)}:${dd(s)}` : `${dd(h)}:${dd(m)}:${dd(s)}`
}

export default async function(message, bot) {

  message.output = new DiscordJS.MessageEmbed()

  message.output.setTitle("🤖 Bot statistics")
  message.output.setURL(pkg.homepage)
  message.output.setColor(bot.data.settings.color)
  
  message.output.addField(pkg.name, 'v' + pkg.version,            true)
  message.output.addField("\u200b", "\u200b",                     true)
  message.output.addField("Uptime", formatTime(process.uptime()), true)
  message.output.addField("Node",   process.version,              true)

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