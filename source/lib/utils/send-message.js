function sendMessage(
  { serviceID, output, isCode, isReply, isFile, author, fullMessage },
  env = process.env,
  { twitchIRC } = require('../services.js')
) {

  switch (serviceID) {
    case 'discord':
      if (isFile) {
        fullMessage.channel.send('', {files: [output]})
      } else if (isReply) {
        fullMessage.reply(output)
      } else if (isCode) {
        fullMessage.channel.send(output, {code: true})
      } else {
        fullMessage.channel.send(output)
      }
      break

    case 'twitchIRC':
      if (isReply) {
        twitchIRC.channel(`#${env.TWITCH_CHANNEL}`).say(`@${author.username} ${output}`)
      } else {
        twitchIRC.channel(`#${env.TWITCH_CHANNEL}`).say(output)
      }
      break
  }

}

module.exports = sendMessage