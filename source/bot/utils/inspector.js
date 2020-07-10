import log      from "./log"

export const intervals = {}

export default async function inspector(service, bot) {

  try {

    log({label: service, message: "Running inspector"})
  
    if (service != "discord") return
    
    for (const cachedMsg of bot.data.cachedMessages) {
      let channel, message

      try {
        // cache messages
        channel = await bot.discord.channels.fetch(cachedMsg.channelID)
        message = await channel.messages.fetch(cachedMsg.messageID)

        for (const roleReaction of cachedMsg.roleReactions) {
          const reaction = message.reactions.cache.find(react => react.emoji.id   == roleReaction.emojiID
                                                              || react.emoji.name == roleReaction.emojiID)

          if (!reaction) continue

          const users   = await reaction.users.fetch()
          const members = (await Promise.allSettled(users.map(user => message.guild.members.fetch(user.id)))).map(settled => settled.value)
          const role    = await message.guild.roles.fetch(roleReaction.roleID) 

          if (members.length <= 0 || !role)
            continue
       
          for (const member of members) {
            if (!member.roles.cache.find(role => role.id == roleReaction.roleID))
              member.roles.add(role)
          }
      
        }
      } catch (err) {
        if (!channel) {
          log({label: service, message: `Unable to find channel with ID "${cachedMsg.channelID}"`})
        } else if (!message) {
          log({label: service, message: `Unable to find message with ID "${cachedMsg.messageID}"`})
        } else {
          console.error(err)
        }
      }
    }
  } catch (err) {
  
    console.error(err)
  
  } finally {

    log({label: service, message: "Inspector finished"})

  }

}