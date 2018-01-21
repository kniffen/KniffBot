async function throwCmd(message) {

  if (!message.args.length) {
    message.output = 'Missing arguments, use !throw [string]'
  } else {
    message.output = `(╯°□°）╯︵ ${message.args.join(' ')}`
  }

  return message

}

module.exports = throwCmd