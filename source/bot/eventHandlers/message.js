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

    // Quit if command is restricted
    if (command.isRestricted && !message.isOwner) {
      message.output  = "You do not have permission to use this command."
      message.isReply = true
      
      return sendMessage(message, bot)
    }

    message = await command.default(message, bot)

  } else if (cleverbot && (message.isMentioned || message.isDM)) {

    let cleanInput = message.cleanInput.slice().toLowerCase()

    while (cleanInput.includes(`@${message.self.username.toLowerCase()}`)) {
      cleanInput = cleanInput.replace(`@${message.self.username.toLowerCase()}`, '')
      if (cleanInput[0] == ' ') cleanInput = cleanInput.substr(1)
    }

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