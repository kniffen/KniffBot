/**
  * 8ball command
  * The a digital representation of the classic 8ball toy
  */

export const id           = "8ball"
export const category     = "fun"
export const services     = ["discord", "twitchIRC"]
export const args         = [["<question>"]]
export const isRestricted = false

const answers = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes, definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful'
]

export default async function eightBall(message, bot) {

  if (!message?.command?.args.length) {
    message.output = `Something went wrong 😱\nDo \`${bot.settings.prefix}help ${id}\` for usage.`
  } else {
    message.output = answers[ Math.floor( Math.random() * answers.length ) ]
    message.isReply = true
  }

  return message

}