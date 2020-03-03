/**
  * message handler/callback
  *
  * TODO
  * - Handle missing command arguments instead of in the command functions
  * - 
  */

import commands     from "../commands"
import parseMessage from "../utils/parseMessage"
import sendMessage  from "../utils/sendMessage"

export default async function messageEventHandeler(service, data, bot) {
  
  const { cleverbot } = bot
  let message = parseMessage(service, data, bot)

  // Quit early if the message is from a bot
  if (message.isBot) return

  if (message.command) {

    let command

    for (const key in commands) {
      if (commands[key].id == message.command.id)
        command = commands[key]
    }

    // Quit if the command does not exist
    if (!command || !command.services.includes(service)) return

    message = await command.default(message, bot)

  } else if (cleverbot && (message.isMentioned || message.isDM)) {

    const cleanInput = message.cleanInput.split(' ')
                              .filter(word => word.toLowerCase() != `@${message.self.username.toLowerCase()}`)
                              .join(' ')

    message.isReply = true
    
    try {
      message.output = await new Promise((resolve) => { cleverbot.write(cleanInput, answer => resolve(answer.message)) })
    } catch (err) {
      message.output = "I'm sorry, can you repeat that?"
    }

  }

  if (message.output)
    sendMessage(message, bot)
}