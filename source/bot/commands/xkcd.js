/**
  * XKCD command
  * Outputs the latest or a specified XKCD comic
  */

import fetch from "node-fetch"

export const id           = "xkcd"
export const category     = "fun"
export const services     = ["discord", "twitchIRC"]
export const args         = [[], ["<id>"]]
export const isRestricted = false

export default async function(message, bot) {

  try {
  
    const id = message.command?.args[0]
    const obj = await fetch(id ? `https://xkcd.com/${id}/info.0.json` : 'https://xkcd.com/info.0.json')
                        .then(res => res.json())

    message.output = obj.img

  } catch (err) {

    message.output = "https://imgs.xkcd.com/comics/not_available.png"

  }

  message.isFile = true

  return message

}