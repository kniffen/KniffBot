import log      from "./log"
import saveData from "./saveData"

export const intervals = {}

export default async function inspector(service, bot) {

  try {

    log({label: service, message: "Running inspector"})
  
    if (service != "discord") return

    const roleChecks = []
    const cachedMessages = bot.data.cachedMessages.slice()

    for (const cachedMsg of cachedMessages) {
      const channel   = await bot.discord.channels.fetch(cachedMsg.channelID)
      const message   = await channel.messages.fetch(cachedMsg.messageID)

      if (!message) {
        const i = bot.data.cachedMessages.findIndex(msg => msg.channelID == cachedMsg.channelID
                                                        && msg.messageID == cachedMsg.messageID)
        bot.data.cachedMessages.splice(i, 1)
        saveData(bot.data)
        continue
      } 
      
      for (const roleReaction of cachedMsg.roleReactions) {
        const reaction = message.reactions.cache.find(react => react.emoji.id   == roleReaction.emojiID
                                                            || react.emoji.name == roleReaction.emojiID)

        if (!reaction) {
          const i = bot.data.cachedMessages.findIndex(msg => msg.channelID == cachedMsg.channelID
                                                          && msg.messageID == cachedMsg.messageID)
          
          if (bot.data.cachedMessages[i].roleReactions.length <= 1) {
            bot.data.cachedMessages.splice(i, 1)
          } else {
            const j = bot.data.cachedMessages[i].roleReactions.findIndex(rr => rr.emojiID == roleReaction.emojiID)
            bot.data.cachedMessages[i].roleReactions.splice(j, 1)
          }
 
          saveData(bot.data)
 
          continue
        }

        const [ role, users ] = await Promise.all([
          message.guild.roles.fetch(roleReaction.roleID),
          reaction.users.fetch()
        ])

        roleChecks.push({role, reaction})
      }
    }

    for (const [ guildID, guild ] of bot.discord.guilds.cache) {
      for (const [ memberID, member ] of guild.members.cache) {
        for (const check of roleChecks) {
          const hasRole        = member.roles.cache.find(role => role.id == check.role.id)          ? true : false
          const shouldHaveRole = check.reaction.users.cache.find(user => user.id == member.user.id) ? true : false

          if (!hasRole && shouldHaveRole) {
            log({label: service, message: `Adding missing role \`${check.role.name}\` to ${member.user.username}`})
            member.roles.add(check.role)
          } else if (hasRole && !shouldHaveRole) {
            log({label: service, message: `Removing unwanted role \`${check.role.name}\` from ${member.user.username}`})
            member.roles.remove(check.role)
          }
        }
      }
    }
  
  } catch (err) {
  
    console.log(err)
  
  } finally {

    log({label: service, message: "Inspector finished"})
  
  }

}