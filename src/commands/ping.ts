import { Message, Command } from '../types'

const pingCommand: Command = {
  id: 'ping',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'utility',
  args: [[]],
  isRestricted: false,
  run
}

async function run(message: Message) {

  message.output = 'Pong!'

}

export default pingCommand