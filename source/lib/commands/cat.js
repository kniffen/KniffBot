async function cat(message, fetch = require('node-fetch')) {
  const obj = await fetch('http://aws.random.cat/meow').then(res => res.json())

  message.output = obj.file ? obj.file : 'http://i.imgur.com/Bai6JTL.jpg'
  message.isFile = true

  return message
}

module.exports = cat