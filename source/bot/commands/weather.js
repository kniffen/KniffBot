/**
  * Weather command
  * Outputs a weather report for a given location
  */

import { promisify } from "util"

import DiscordJS from "discord.js"
import weatherJS from "weather-js"

export const id       = "weather"
export const category = "info"
export const services = ["discord", "twitchIRC"]
export const args     = [
  [],
  ["<location>"],
  ["@username"]
]

export default async function weather(message, bot) {

  try {

    let query, profile

    message.isReply = true
    message.output  = `Something went wrong 😱\nDo \`${bot.settings.prefix}help ${id}\` for usage.`

    if (!message?.mentions?.length && message?.command?.args.length) {
      query = message.command.args.join(' ')

    } else {

      const profiles = bot.profiles.filter(profile => profile.service == message.service)

      if (profiles.length <= 0)
        return message

      if (message?.mentions?.length) {
        profile = profiles.find(profile => profile.id == message.mentions[0].id)
        if (profile) profile.username = message.mentions[0].username
      } else {
        profile = profiles.find(profile => profile.id == message.author.id)
        if (profile) profile.username = message.author.username
      }

      message.output  = `Sorry, I don't have a location set for you\nUse \`${bot.settings.prefix}profile location <name or zip code>\` here or in a PM to set one`

      if (!profile)
        return message

      query = profile.location

    }

    if (!query)
      return message
    
    message.isReply = false

    const data = await promisify(weatherJS.find)({
      search: query,
      degreeType: 'C'
    })

    const { location, current, forecast } = data[0]

    if (message.service == "discord") {

      message.output = new DiscordJS.RichEmbed()

      message.output.setAuthor(`Weather report for ${profile?.username || location.name}`, current.imageUrl)        
      message.output.setColor(bot.settings.color)
      
      message.output.addField(`${current.day} ${current.observationtime}`, current.skytext)
      message.output.addField("Temp", `${current.temperature}°C/${Math.floor(current.temperature*1.8+32)}°F`, true)
      message.output.addField("Feels like", `${current.feelslike}°C/${Math.floor(current.feelslike*1.8+32)}°F`, true)
      
      const windKph = parseInt(current.windspeed.split(' ').shift())
      message.output.addField("Wind", `${Math.round(windKph * 0.277778)}m/s or ${Math.round(windKph * 0.621371)}mph ${current.winddisplay.split(' ').pop()}`, true)

      message.output.addField(`${forecast[1].day} forecast`, forecast[1].skytextday)
      message.output.addField("Temp low", `${forecast[1].low}°C/${Math.floor(forecast[1].low*1.8+32)}°F`, true)
      message.output.addField("Temp high", `${forecast[1].high}°C/${Math.floor(forecast[1].high*1.8+32)}°F`, true)
      message.output.addField("Precip probability", `${parseInt(forecast[1].precip)}%`, true)

      message.output.setFooter("Weather report provided by Microsoft")

    } else {

      message.output = `Weather report for ${location.name}\n${current.skytext} ${current.temperature}°C/${Math.floor(current.temperature*1.8+32)}°F`

    }

    return message
  
  } catch (err) {

     message.isReply = true
     message.output  = "Something went wrong 😱\nI was unable to fetch a weather report for you"
    
    return message
  }

}