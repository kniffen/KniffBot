/**
  * Comic command
  * Generates comic strips based on channel message history
  *
  * TODO
  * 1. Add more comics
  * 2. Insert emotes into image
  * 3. Write unit test (should probably be #1)
  */

import path from "path"
import Jimp from "jimp"

import parseMessage from "../utils/parseMessage"

export const id           = "comic"
export const category     = "fun"
export const services     = ["discord"]
export const args         = [["<amount>"]]
export const isRestricted = false

export default async function(message, bot) {


  let amount = parseInt(message.command.args[0]) || 1
  if (amount > 2) amount = 2

  const images = [
    {
      path: "../../../comics/demo.png",
      positions: [[120, 10]]
    },
    {
      path: "../../../comics/demo.png",
      positions: [[120, 10], [140, 100]]
    }
  ]

  const loadedImg = await Jimp.read(path.resolve(__dirname, images[amount - 1].path))
  const font      = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
  const messages  = (await message.original.channel.fetchMessages()).array()
                                                                    .map(msg => parseMessage(message.service, msg, bot))
                                                                    .filter(msg => !msg.command && !msg.isBot)

  for (let i = 0; i < amount; i++) {
    loadedImg.print(font,
                    images[amount - 1].positions[i][0],
                    images[amount - 1].positions[i][1],
                    messages[i].cleanInput)
  }

  message.output = await loadedImg.getBufferAsync("image/png")
  message.isFile = true

  return message

}