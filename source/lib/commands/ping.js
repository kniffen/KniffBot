async function ping(
  message,
  date = Date
) {

  message.output = `Pong!${message.timestamp ? ` (${date.now() - message.timestamp}ms)` : ''}`

  // TODO
  // - Add ping time for argument url

  return message

}

module.exports = ping