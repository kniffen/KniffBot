/**
  * Wolfram|Alpha command
  * Outputs data from a Wolfram|Alpha search
  */

import DiscordJS from "discord.js"

export const id       = "wolfram"
export const category = "info"
export const services = ["discord"]
export const args     = [["<query>"]]

export default async function wolfram(message, bot) {

  if (message.command.args.length <= 0) {
    message.output = `Something went wrong 😱\nDo \`${bot.settings.prefix}help ${id}\` for usage.`
    return message
  }

  const query = message.command.args.join(' ')

  try {
    const result = await bot.wolframAlpha.query(query)
    
    message.output = new DiscordJS.RichEmbed()

    message.output.setTitle(result.data.queryresult.pods[0].subpods[0].plaintext)
    message.output.setColor(bot.settings.color)
    message.output.setURL(result.data.queryresult.sources?.url)

    for (const pod of result.data.queryresult.pods.filter((pod, i) => i > 0)) {
      const text   = pod.subpods.filter(subpod => subpod.plaintext != '').map(subpod => subpod.plaintext).join("\n")
      const images = pod.subpods.filter(subpod => subpod.img?.src  != '').map(subpod => subpod.img?.src)

      if (text) {
        message.output.addField(pod.title, text)
      } else if (images.length > 0) {
        message.output.setImage(images[0])
      }  
    }

  } catch (err) {

    message.output = `Could not find any Wolfram|Alpha data for **${query}**`

  }

  return message

}