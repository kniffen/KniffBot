/**
  * Throw command
  * Throws the input
  */

export const id       = "throw"
export const category = "fun"
export const services = ["discord", "twitchIRC"]
export const args     = [[], ["<thing>"]]

export default async function throwCmd(message, bot) {

  message.output = `(╯°□°）╯︵ ${message.input.replace(`${bot.settings.prefix}${id}`, '')}`

  for (const emoji of message.emojis) {
    const e = bot.discord.emojis.get(emoji.id)

    message.output = message.output.replace(emoji.string, e || emoji.name)
  }

  return message

}