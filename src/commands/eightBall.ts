import { Message, Command } from '../types'

const answers: string[] = [
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

const eightBallCommand: Command = {
  id: '8ball',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'fun',
  args: [['question']],
  isRestricted: false,
  run
}

async function run(message: Message) {
  
  message.output = answers[Math.floor(Math.random() * answers.length)]
  message.isReply = true

}

export default eightBallCommand