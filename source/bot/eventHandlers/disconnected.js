/**
  * Disconnection event handler/callback
  */

import log from "../../bot/utils/log"

export default function disconnectedEventHandler(id, bot) {

  log({
    label: id,
    message: "disconnected", 
  })

  if (id == "discord")
    bot.discord.login(process.env.DISCORD_TOKEN)

}