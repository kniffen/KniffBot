import log      from "./log"
import saveData from "./saveData"

export const intervals = {}

export default async function inspector(service, bot) {

  log({
    label: service,
    message: "running inspector", 
  })

  if (service != "discord") return

  // scan cached messages
  const cachedMessages = bot.data.cachedMessages.slice()
  const channels       = bot.discord.channels.cache.array()

  for (const cachedMessage of cachedMessages) {
    let message

    for (const channel of channels) {
      if (channel.type != "text") continue

      message = await channel.messages.fetch(cachedMessage.messageID)
                                      .then(msg => msg.channel.id == cachedMessage.channelID ? msg : undefined)
                                      .catch(() => { /* ignore */ })

      if (message) break 
    }

    if (!message) {
      // Remove deleted messages
      const i = bot.data.cachedMessages.findIndex(msg => msg.channelID == cachedMessage.channelID &&  msg.messageID == cachedMessage.messageID)
      bot.data.cachedMessages.splice(i, 1)
           
    } else {
      for (const [ memberID, member ] of message.guild.members.cache) {
        for (const [ emojiID, reaction ] of message.reactions.cache) {
          const roleReaction = cachedMessage.roleReactions.find(rr => rr.emojiID == emojiID)

          if (!roleReaction) continue

          const users          = await reaction.users.fetch()
          const role           = await message.guild.roles.fetch(roleReaction.roleID)
          const hasRole        = member.roles.cache.find(role => role.id == roleReaction.roleID) ? true : false
          const shouldHaveRole = users.array().find(user => user.id == member.user.id) ? true : false

          if (!hasRole && shouldHaveRole) {
            member.roles.add(role)
          } else if (hasRole && !shouldHaveRole) {
            member.roles.remove(role)
          }
        }
      }
    }
  }

  saveData(bot.data)
}