export default async function reactionAdded(reaction, user, bot) {

  const cachedMessage = bot.data.cachedMessages.find(msg => msg.channelID == reaction.message.channel.id && msg.messageID == reaction.message.id)

  if (!cachedMessage) return

  const roleReaction = cachedMessage.roleReactions.find(rr => rr.emojiID == reaction.emoji.id || rr.emojiID == reaction.emoji.name)

  if (!roleReaction) return

  const member = await reaction.message.channel.guild.members.fetch(user.id)
  const role   = await reaction.message.channel.guild.roles.fetch(roleReaction.roleID)

  member.roles.add(role).catch(console.error)

}