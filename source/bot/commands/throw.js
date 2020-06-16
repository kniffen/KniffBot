/**
  * Throw command
  * Throws the input
  */

export const id           = "throw"
export const category     = "fun"
export const services     = ["discord", "twitchIRC"]
export const args         = [[], ["<thing>"]]
export const isRestricted = false

export default async function throwCmd(message, bot) {

  message.output = `(╯°□°）╯︵ ${message.input.replace(`${bot.data.settings.prefix}${id}`, '')}`

  return message

}