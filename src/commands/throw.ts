import { Message, Command } from '../types'

const throwCommand: Command = {
  id: 'throw',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'fun',
  args: [['item']],
  isRestricted: false,
  run
}

async function run(message: Message): Promise<void> {

  message.output = `(╯°□°）╯︵ ${message.command.args.join(' ')}`

}

export default throwCommand