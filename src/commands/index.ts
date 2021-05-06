import catCommand from './cat'
import dogCommand from './dog'
import eightBallCommand from './eightBall'
import helpCommand from './help'
import pingCommand from './ping'
import throwCommand from './throw'
import timeCommand from './time'
import weatherCommand from './weather'
import wolframCommand from './wolfram'
import xkcdCommand from './xkcd'

import { Command } from '../types'

const commands: Command[] = [
  catCommand,
  dogCommand,
  eightBallCommand,
  helpCommand,
  pingCommand,
  throwCommand,
  timeCommand,
  weatherCommand,
  wolframCommand,
  xkcdCommand,
]

export default commands