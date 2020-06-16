/**
  * Role reaction command
  * Adds a custom role to a user that reacts to the output message
  */

import saveData from "../utils/saveData"

export const id           = "addrolereact"
export const category     = "utility"
export const services     = ["discord"]
export const args         = [["<message id>", "<@role>", "<:emoji:>"]]
export const isRestricted = true

export default async function addRoleReact(message, bot) {

  try {
    let channelID, rrMessage
    const messageID = message?.command?.args[0]
    const roleID    = message.original?.mentions?.roles.entries().next().value[0]
    const emojiID   = message.emojis[0]?.id || message.command.args[2]
    
    for(const channel of bot.discord.channels.cache.array()) {
      if (channel.type != "text") continue
      
      rrMessage = await channel.messages.fetch(messageID)

      if (rrMessage) channelID = channel.id
    }

    const cachedMessage = bot.data.cachedMessages.find(msg => msg.channelID == channelID && msg.messageID == messageID)

    if (cachedMessage) {
      const role = cachedMessage.roleReactions.find(rr => rr.roleID == roleID)

      if (role) {
        role.emojiID = emojiID
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

    await rrMessage.react(emojiID)

  } catch (err) {

    console.log(err)
  
    message.output = `Something went wrong 😱Do \`${bot.data.settings.prefix}help ${id}\` for usage.`
    message.isReply = true
  
  }

  return message

}