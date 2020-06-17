/**
  * Connection event handler/callback
  */

import log      from "../utils/log"
import saveData from "../utils/saveData"

export default async function connectedEventHandler(id, bot) {

  log({
    label: id,
    message: "connected", 
  })

  // cache role reaction messages
  if (id == "discord")  {
    log({
      label: id,
      message: "caching role reaction messages", 
    })

    const messages = bot.data.cachedMessages
    const channels = bot.discord.channels.cache.array()
    
    for (let i = 0; i < messages.length; i++) {
      let msg

      for(const channel of channels) {
        if (channel.type != "text") continue

        msg = await channel.messages.fetch(messages[i].messageID).catch(() => { /* ignore */ })

        if (msg) break    
      }

      // Remove deleted messages
      if (!msg) {
        bot.data.cachedMessages.splice(i, 1)
        saveData(bot.data)
      }
    }
  }

}