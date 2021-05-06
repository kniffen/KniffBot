import moment from 'moment-timezone'
import fetch  from 'node-fetch'

import { Message, Command } from '../types'

const timeCommand: Command = {
  id: 'time',
  allowedServices: ['discord', 'twitchIRC'],
  category: 'info',
  args: [[], ['location']],
  isRestricted: false,
  run
}

async function run(message: Message) {

  const location = message.command.args.join(' ')

  message.isReply = true

  if (!location) {
    message.output = `It's currently ${moment.utc().format("LLLL z")}`
    
    return
  }

  try {
    const geopath = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${encodeURI(location)}`
    const { lat, lng } = (await fetch(geopath).then(res => res.json())).results[0].geometry.location
    const tzpath = `https://maps.googleapis.com/maps/api/timezone/json?key=${process.env.GOOGLE_API_KEY}&location=${lat},${lng}&timestamp=0&sensor=false` 
    const timezone = (await fetch(tzpath).then(res => res.json())).timeZoneId

    const timeStr = moment.tz(Date.now(), timezone).format("LLLL")

    message.output = `It's ${timeStr} in ${timezone}`        

  } catch(err) {
    message.output = `Unable to fetch the time for **${location}**`

  }

}

export default timeCommand