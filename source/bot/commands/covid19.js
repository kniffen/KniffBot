/**
  * COVID-19 command
  * outputs data about the corona virus
  */

import fetch from "node-fetch"
import { RichEmbed } from "discord.js"

export const id           = "covid19"
export const category     = "info"
export const services     = ["discord"]
export const args         = [[], ["country/state"]]
export const isRestricted = false

export default async function covid19Cmd(message, bot) {
  let total, country, countryYesterday, state, stateYesterday, news

  total = await fetch("https://corona.lmao.ninja/v2/all")?.then(res => res.json())
  
  if (message.command.args.length > 0) {
    const data = await Promise.all([
      fetch("https://corona.lmao.ninja/v2/countries")?.then(res => res.json()),
      fetch("https://corona.lmao.ninja/v2/states")?.then(res => res.json())
    ])

    country = data[0].find(country => country.country.toLowerCase() == message.command.args.join(' ').toLowerCase())

    if (!country) {
      country = data[0].find(country => country.countryInfo.iso3 == "USA")
      state   = data[1].find(state   => state.state.toLowerCase() == message.command.args.join(' ').toLowerCase())
    }
  }

  message.output = new RichEmbed()

  message.output.setColor(bot.data.settings.color)
  message.output.setTimestamp(total.updated)
  message.output.setFooter("Data provided by worldometers.info/coronavirus")

  if (message.command.args.length <= 0) {
    message.output.setAuthor("Latest COVID-19 global stats")

    message.output.addField("Cases",     total.cases.toLocaleString(),     true)
    message.output.addField("Deaths",    total.deaths.toLocaleString(),    true)
    message.output.addField("Recovered", total.recovered.toLocaleString(), true)
     
  } else {
    const location = state || country

    message.output.setAuthor(`Latest COVID-19 stats for ${location.country || location.state}`, country.countryInfo.flag, 'https://worldometers.info/coronavirus')

    message.output.addField("Active",             location?.active?.toLocaleString()               || "\u200b", true)
    message.output.addField("Critical",           location?.critical?.toLocaleString()             || "\u200b", true)
    message.output.addField("Recovered",          location?.recovered?.toLocaleString()            || "\u200b", true)

    message.output.addField("Cases",              location?.cases?.toLocaleString()                || "\u200b", true)
    message.output.addField("Cases today",        location?.todayCases?.toLocaleString()           || "\u200b", true)
    message.output.addField("Cases per million",  location?.casesPerOneMillion?.toLocaleString()   || "\u200b", true)
    
    message.output.addField("Deaths",             location?.deaths?.toLocaleString()               || "\u200b", true)
    message.output.addField("Deaths today",       location?.todayDeaths?.toLocaleString()          || "\u200b", true)
    message.output.addField("Deaths per million", location?.deathsPerOneMillion?.toLocaleString()  || "\u200b", true)

    message.output.addField("Tests",              location?.tests?.toLocaleString()   || "\u200b", true)
    message.output.addBlankField(true)
    message.output.addField("Tests per million",  location?.testsPerOneMillion?.toLocaleString()   || "\u200b", true)
  }

  return message

}