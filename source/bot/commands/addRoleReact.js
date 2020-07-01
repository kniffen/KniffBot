/**
  * Role reaction command
  * Adds a custom role to a user that reacts to the output message
  */

import saveData from "../utils/saveData"

export const id           = "addrolereact"
export const category     = "utility"
export const services     = ["discord"]
export const args         = [["<message id>", "<:emoji:>", "<@role>"]]
export const isRestricted = true

export default async function addRoleReact(message, bot) {

  try {
    let channelID, rrMessage
    const messageID = message?.command?.args[0]
    const mentionedRole = message.original?.mentions?.roles.entries().next().value
    const roleID        = mentionedRole ? mentionedRole[0] : undefined
    const emojiID   = message.emojis[0]?.id || message.command.args[1]
    
    for(const channel of bot.discord.channels.cache.array()) {
      if (channel.type != "text") continue

      rrMessage = await channel.messages.fetch(messageID).catch(() => { /* ignore */ })

      if (rrMessage) {
        channelID = channel.id
        break
      }
    }

    const cachedMessage = bot.data.cachedMessages.find(msg => msg.channelID == channelID && msg.messageID == messageID)
    const member        = await message.original.channel.guild.members.fetch(bot.discord.user.id)
    const role          = await message.original.channel.guild.roles.fetch(roleID)

    await member.roles.add(role)
    await member.roles.remove(role)
    await rrMessage.react(emojiID)

    if (cachedMessage) {
      const rrExisting = cachedMessage.roleReactions.find(rr => rr.roleID == roleID)
      
      if (rrExisting) {
        rrExisting.emojiID = emojiID
      } else {
        cachedMessage.roleReactions.push({roleID, emojiID})
      }
    } else {
      bot.data.cachedMessages.push({
        channelID,
        messageID,
        roleReactions: [{roleID, emojiID}]
      })
    }

    saveData(bot.data)

  } catch (err) {

    message.output = `Something went wrong 😱\nDo \`${bot.data.settings.prefix}help ${id}\` for usage.`
    message.isReply = true
  
  }

  return message

}