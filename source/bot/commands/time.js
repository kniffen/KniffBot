/**
  * Time command
  * Outputs the time for a given location or UTC
  *
  * TODO
  * - Replace google API calls... somehow
  */

import moment from "moment-timezone"
import fetch  from "node-fetch"

export const id           = "time"
export const category     = "info"
export const services     = ["discord", "twitchIRC"]
export const isRestricted = false
export const args         = [
  [],
  ["<location>"],
  ["@username"]
]

export default async function(message, bot) {

  let location

  if (message?.mentions?.length > 0) {
    location = bot.data.profiles.find(profile => profile.service == message.service && profile.id == message.mentions[0].id)?.location
    if (!location) {
      message.output  = "I don't have a location set for that user"
      message.isReply = true
    }

  } else if (message.command?.args?.length > 0) {
    location = message.command.args.join(' ')

  } else {
    location = bot.data.profiles.find(profile => profile.service == message.service && profile.id == message.author.id)?.location
    if (!location) {
      message.output = `\`${moment.utc().format("LLLL z")}\``
    }
  }
  
  if (location) {
    try {
      const geopath      = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${encodeURI(location)}`
      const { lat, lng } = (await fetch(geopath).then(res => res.json())).results[0].geometry.location
      const tzpath       = `https://maps.googleapis.com/maps/api/timezone/json?key=${process.env.GOOGLE_API_KEY}&location=${lat},${lng}&timestamp=0&sensor=false` 
      const timezone     = (await fetch(tzpath).then(res => res.json())).timeZoneId 

      const timeStr = moment.tz(Date.now(), timezone).format("LLLL")

      if (message.command?.args?.length > 0) {
        message.output = `\`${timeStr} ${timezone}\``        
      } else {
        message.output =  `It's \`${timeStr}\` for ${message.mentions?.length > 0 ? message.mentions[0].username : message.author.username}`
      }
    } catch(err) {
      message.output = "Something went wrong 😱\nI was unable to fetch the time for you"
    }
  }

  return message

}