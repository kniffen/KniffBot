import saveData from "../utils/saveData"

export const id           = "removerolereact"
export const category     = "utility"
export const services     = ["discord"]
export const args         = [
  ["<message id>"],
  ["<message id>", "<@role>"]
]
export const isRestricted = true

export default async function removeRoleReact(message, bot) {

  try {

    const messageID     = message?.command?.args[0]
    const mentionedRole = message.original?.mentions?.roles.entries().next().value
    const roleID        = mentionedRole ? mentionedRole[0] : undefined

    let channelID, rrMessage
    for(const channel of bot.discord.channels.cache.array()) {
      if (channel.type != "text") continue
      
      rrMessage = await channel.messages.fetch(messageID).catch(() => { /* ignore */ })

      if (rrMessage) {
        channelID = channel.id
        break
      }
    }

    if (!rrMessage) {
      message.output  = "Sorry, I was unable to find that message."
      message.isReply = true
      
      return message
    }

    const cachedMessageIndex = bot.data.cachedMessages.findIndex(msg => msg.channelID == channelID && msg.messageID == messageID)

    if (roleID) {
      const roleIndex = bot.data.cachedMessages[cachedMessageIndex].roleReactions.findIndex(rr => rr.roleID == roleID)
      const reaction  = rrMessage.reactions.resolve(bot.data.cachedMessages[cachedMessageIndex].roleReactions[roleIndex].emojiID)

      await reaction.remove()
      bot.data.cachedMessages[cachedMessageIndex].roleReactions.splice(roleIndex, 1)
      saveData(bot.data)

    } else {
      await rrMessage.reactions.removeAll()
      bot.data.cachedMessages.splice(cachedMessageIndex, 1)
      saveData(bot.data)         
    }

  } catch (err) {
  
    message.output = `Something went wrong 😱\nDo \`${bot.data.settings.prefix}help ${id}\` for usage.`
    message.isReply = true

  }
  
  return message

}