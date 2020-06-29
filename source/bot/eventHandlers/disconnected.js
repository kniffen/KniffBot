/**
  * Disconnection event handler/callback
  */

import log from "../utils/log"
import * as inspector from "../utils/inspector"

export default function disconnectedEventHandler(id, bot) {

  log({
    label: id,
    message: "disconnected", 
  })

  clearInterval(inspector.intervals[id])

  if (id == "discord")
    bot.discord.login(process.env.DISCORD_TOKEN)

}