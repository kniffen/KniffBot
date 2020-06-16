/**
  * Profile command
  * Outputs infromation and modifies a user's profile 
  */

import DiscordJS from "discord.js"
import moment    from "moment-timezone"

import saveData from "../utils/saveData"

export const id           = "profile"
export const category     = "utility"
export const services     = ["discord"]
export const isRestricted = false
export const args         = [
  [],
  ["location"],
  ["location", "<location>"],
  ["remove", "<item>"],
  ["@username"]
]

export default async function profile(message, bot) {

  let index, member
  let roles = []
  let joinedTimestamp = 0

  let user = message.mentions?.length > 0 ? message.mentions[0] : message.author

  if (!message.isDM) {
    member = await message.original?.channel.guild.members.fetch(user.id)

    user            = member?.user 
    roles           = member?.roles.cache
    joinedTimestamp = member?.joinedTimestamp
  }

  if ((message.isDM && message.mentions.length > 0) || (!message.isDM && !member)) {
    message.output = "Unable to find user profile"
    message.isReply = true
    return message 
  }

  index = bot.data.profiles.findIndex(profile => profile.service == message.service && profile.id == user.id)

  // Create a user profile if one does not exist
  if (index < 0 && message.command?.args[0] != "remove") {
    bot.data.profiles.push({id: user.id,service: message.service})
    saveData(bot.data)
    index = bot.data.profiles.length - 1
  }

  if (message.command?.args[0] == "remove") {
    const prop = message.command.args[1]
    
    if (index < 0) return message
    
    if (prop) {
      if (["id", "service"].includes(prop) || !bot.data.profiles[index][prop]) return message
      delete bot.data.profiles[index][prop]

      message.output = `Your ${prop} has been removed`
      message.isReply = true
    } else {
      bot.data.profiles.splice(index, 1)
      message.output = `Your profile has been removed`
      message.isReply = true
    }

    saveData(bot.data)

  } else if (message.command?.args[0] == "location") {
    if (!message.command.args[1]) {
      message.output  = `Your current location is ${bot.data.profiles[index].location || "unknown"}`
      message.isReply = true
    } else {
      const args = message.command.args.slice()
      args.shift()
      bot.data.profiles[index].location = args.join(' ')
      saveData(bot.data)
      message.output  = `Your location is now set to ${bot.data.profiles[index].location}`
      message.isReply = true
    }

  } else {
    roles = roles.filter(role => role.name != "@everyone").map(role => role.name)

    message.output = new DiscordJS.MessageEmbed()

    message.output.setAuthor(`Profile for ${user.username}`, user.avatarURL)
    message.output.setColor(bot.data.settings.color)

    message.output.addField("Discriminator", '#'+user.discriminator, true)
    message.output.addField("Identifier",    user.id, true)
    
    if (!message.isDM) {
      message.output.addField("Status", user.presence.status, true)
      message.output.addField(`Account created`, moment(user.createdTimestamp).format("LL"), true)
      message.output.addField(`Joined ${message.original.channel.guild.name}`, moment(joinedTimestamp).format("LL"),       true)
    }

    if (roles.length > 0)
      message.output.addField("Roles", roles.join(", ") || ' ', true)

    if (bot.data.profiles[index]?.location && message.isDM)
      message.output.addField("Location", bot.data.profiles[index].location, true)
  }

  return message

}