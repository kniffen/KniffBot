import moment    from "moment-timezone"
import DiscordJS from "discord.js"

export const id           = "uptime"
export const category     = "info"
export const services     = ["discord"]
export const args         = [[]]
export const isRestricted = false

export default async function uptimeCmd(message, bot) {

  const uptime    = moment().utc().unix() * 1000 - process.uptime() * 1000
  const lastLogin = moment().utc().unix() * 1000 - bot.discord.uptime

  message.output = new DiscordJS.MessageEmbed()

  message.output.setTitle("⏱️ Bot uptime")
  message.output.setColor(bot.data.settings.color)

  message.output.addField("Last launched", `${moment.utc(uptime).format("LLLL z")}\n(${moment(uptime).fromNow()})`)
  message.output.addField("Last login",    `${moment.utc(lastLogin).format("LLLL z")}\n(${moment(lastLogin).fromNow()})`)
  
  return message

}