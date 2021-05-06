import { promisify } from 'util'

import DiscordJS from 'discord.js'
const weatherJS = require('weather-js')

import settings from '../settings'

import { Message, Command } from '../types'

const weatherCommand: Command = {
  id: 'weather',
  allowedServices: ['discord'],
  category: 'info',
  args: [['location']],
  isRestricted: false,
  run
}

async function run(message: Message) {

  const query = message.command.args.join(' ')

  try {
    const data = await promisify(weatherJS.find)({
      search: query,
      degreeType: 'C'
    })

    const { location, current, forecast } = data[0]


    message.output = new DiscordJS.MessageEmbed()

    message.output.setAuthor(`Weather report for ${location.name}`, current.imageUrl)        
    message.output.setColor(settings.discordEmbedColor)
    
    message.output.addField(`${current.day} ${current.observationtime}`, current.skytext)
    message.output.addField("Temp", `${current.temperature}°C/${Math.floor(current.temperature*1.8+32)}°F`, true)
    message.output.addField("Feels like", `${current.feelslike}°C/${Math.floor(current.feelslike*1.8+32)}°F`, true)
    
    const [ windKph, windUnit, windDirection ] = current.winddisplay.match(/\d+|km\/h|\w+/g)
    message.output.addField("Wind", `${Math.round(windKph * 0.277778)}m/s or ${Math.round(windKph * 0.621371)}mph ${windDirection || ''}`, true)

    message.output.addField(`${forecast[1].day} forecast`, forecast[1].skytextday)
    message.output.addField("Temp low", `${forecast[1].low}°C/${Math.floor(forecast[1].low*1.8+32)}°F`, true)
    message.output.addField("Temp high", `${forecast[1].high}°C/${Math.floor(forecast[1].high*1.8+32)}°F`, true)
    message.output.addField("Precip probability", `${parseInt(forecast[1].precip)}%`, true)

    message.output.setFooter("Weather report provided by Microsoft")

  } catch ( err ) {
    throw new Error(`Unable to fetch a weather report for **${query}**`)

  }

}

export default weatherCommand