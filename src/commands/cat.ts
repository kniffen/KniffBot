import { Message, Command } from '../types'

import fetch from 'node-fetch'

const catCommand: Command = {
  id: 'cat',
  allowedServices: ['discord'],
  category: 'fun',
  args: [[]],
  isRestricted: false,
  run
}

async function run(message: Message) {

  try {

    const data = await fetch('http://aws.random.cat/meow').then(res => res.json())

    message.output = data.file

  } catch ( err ) {

    message.output = 'http://i.imgur.com/Bai6JTL.jpg'

  }

  message.isFile = true

}

export default catCommand