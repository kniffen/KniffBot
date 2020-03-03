/**
  * Function to send messages, replies and files to various APIs
  */

export default function sendMessage(message, bot) {
  
  if (message.service == "discord") {
  
    if (message.isFile) {
      message.original.channel.send('', {files: [message.output]})
    } else if (message.isReply) {
      message.original.reply(message.output)
    } else {
      message.original.channel.send(message.output)
    }
  
  } else if (message.service == "twitchIRC") {
  
    if (message.isReply) {
      bot.twitchIRC.channel(`#${process.env.TWITCH_CHANNEL}`).say(`@${message.author.username} ${message.output}`)
    } else {
      bot.twitchIRC.channel(`#${process.env.TWITCH_CHANNEL}`).say(message.output)
    }
  
  }

}