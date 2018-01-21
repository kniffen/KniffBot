async function ping(
  message,
  date = Date
) {

  message.output = `${date.now() - message.timestamp}ms`

  // TODO
  // - Add ping time for argument url

  return message

}

module.exports = ping