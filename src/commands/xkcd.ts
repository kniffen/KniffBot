import fetch from 'node-fetch'

import { Message, Command } from '../types'

const xkcdCommand: Command = {
  id: 'xkcd',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'fun',
  args: [[], ['id']],
  isRestricted: false,
  run
}

async function run(message: Message) {

  try {
    const id = message.command.args.length > 0 ? message.command.args[0].toString() : ''
    const obj = await fetch(id !== '' ? `https://xkcd.com/${id}/info.0.json` : 'https://xkcd.com/info.0.json').then(res => res.json())

    message.output = obj.img

  } catch ( err ) {
    message.output = 'https://imgs.xkcd.com/comics/not_available.png'

  }

  message.isFile = true

}

export default xkcdCommand