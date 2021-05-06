import { Message, Command } from '../types'

import fetch from 'node-fetch'

const dogCommand: Command = {
  id: 'dog',
  allowedServices: ['discord'],
  category: 'fun',
  args: [[]],
  isRestricted: false,
  run
}

async function run(message: Message) {

  try {

    const data = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())

    message.output = data.message

  } catch ( err ) {

    message.output = 'https://i.imgur.com/9oPUiCu.gif'

  }

  message.isFile = true

}

export default dogCommand