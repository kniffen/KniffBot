require('dotenv-flow').config()

import DiscordJS from 'discord.js'

import { Message, Command } from '../types'
import settings from '../settings'
import wolframAlpha from '../services/wolframAlpha'

const wolframCommand: Command = {
  id: 'wolfram',
  allowedServices: ['discord'],
  category: 'info',
  args: [['query']],
  isRestricted: false,
  run
}

async function run(message: Message) {
  
  if ( message.command.args.length <= 0 ) {
    throw new Error('Missing arguments')
  }

  const query = message.command.args.join(' ')
  
  try {
    const result = await wolframAlpha.query(query)
      
    message.output = new DiscordJS.MessageEmbed()

    message.output.setTitle(result.data.queryresult.pods[0].subpods[0].plaintext)
    message.output.setColor(settings.discordEmbedColor)
    message.output.setURL(result.data.queryresult.sources?.url)

    for ( const pod of result.data.queryresult.pods.filter((pod: any, i: number) => i > 0) ) {
      const text = 
        pod
          .subpods
          .filter((subpod: any) => subpod.plaintext != '')
          .map((subpod: any) => subpod.plaintext)
          .join('\n')

      const images =
        pod
          .subpods
          .filter((subpod: any) => subpod.img?.src != '')
          .map((subpod: any) => subpod.img?.src)

      if ( text ) {
        message.output.addField(pod.title, text)
      } else if ( images.length > 0 ) {
        message.output.setImage(images[0])
      }  
    }

  } catch ( err ) {
    throw new Error(`Could not find any Wolfram|Alpha data for **${query}**`)

  }
}

export default wolframCommand