import { Message } from '../types'

import twitchIRC from '../services/twitchIRC'

export default function sendMessage(message: Message) {

  if ( message.service === 'discord' ) {

    if ( message.isReply ) {
      message.original.reply(message.output)

    } else if ( message.isFile ) {
      message.original.channel.send('', {files: [message.output]})
    
    } else {
      message.original.channel.send(message.output)
    }

  } else if ( message.service === 'twitchIRC' ) {
  
    twitchIRC
      .channel(`#${process.env.TWITCH_CHANNEL}`)
      .say(message.isReply ? `@${message.author.name} ${message.output}` : message.output)

  }

}