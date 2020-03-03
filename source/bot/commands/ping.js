/**
  * Ping command
  * Outputs "pong!" to see if the bot is responsive
  *
  * TODO
  * - Move to settings/options as a static command 
  */
export const id       = "ping"
export const category = "utility"
export const services = ["discord", "twitchIRC"]
export const args     = [[]]

export default async function ping(message) {

  message.output = "pong!"

  return message

}