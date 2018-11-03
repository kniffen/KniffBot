async function xkcdCmd(
  message,
  fetch = require('node-fetch')
) {

  const obj = await fetch(message.args.length ? `https://xkcd.com/${message.args[0]}/info.0.json` : 'https://xkcd.com/info.0.json').then(res => res.json())

  if (obj.img) {
    message.output = obj.img
    message.isFile = true
  }

  return message

}

module.exports = xkcdCmd