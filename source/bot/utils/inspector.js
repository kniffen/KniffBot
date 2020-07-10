import log      from "./log"

export const intervals = {}

export default async function inspector(service, bot) {

  try {

    log({label: service, message: "Running inspector"})
  
    if (service != "discord") return

    const channels = []
    const messages = []
    const members  = {}

    // cache messages
    for (const cachedMsg of bot.data.cachedMessages) {
      let channel, message

      try {
        channel = channels.find(channel => channel.id == cachedMsg.channelID)
        message = messages.find(message => message.id == cachedMsg.messageID && message.channel.id == cachedMsg.channelID)

        if (!channel) {
          channel = await bot.discord.channels.fetch(cachedMsg.channelID)
          channels.push(channel)
        }

        if (!message) {
          message = await channel.messages.fetch(cachedMsg.messageID)
          messages.push(message)
        }

        if (!members[message.guild.id]) {
          members[message.guild.id] = await message.guild.members.fetch()
        }

        for (const roleReaction of cachedMsg.roleReactions) {
          const reaction = message.reactions.cache.find(react => react.emoji.id   == roleReaction.emojiID
                                                              || react.emoji.name == roleReaction.emojiID)
          const [ users, role ] = await Promise.all([
            reaction.users.fetch(),
            message.guild.roles.fetch(roleReaction.roleID)
          ])

          for (const member of members[message.guild.id]) {
            const shouldHaveRole = users.find(user => user.id == member[1].user.id)               ? true : false
            const hasRole        = member[1].roles.cache.find(existing => existing.id == role.id) ? true : false

            if (shouldHaveRole && !hasRole) {
              log({label: service, message: `Adding missing role "${role.name}" to "@${member[1].user.username}"`})
              member[1].roles.add(role)
            }
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

  } catch(err) {

    console.error(err)

  } finally {

    log({label: service, message: "Inspector finished"})
  
  }

}