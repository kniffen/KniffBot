import saveData from  "../utils/saveData"

export default function messageDeleted(service, data, bot) {

  const index = bot.data.cachedMessages.findIndex(msg => msg.channelID == data.channel.id && msg.messageID == data.id)

  if (index < 0) return

  bot.data.cachedMessages.splice(index, 1)
  
  saveData(bot.data)

}