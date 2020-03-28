/**
  * COVID-19 command
  * outputs data about the corona virus
  */

import fetch from "node-fetch"
import { RichEmbed } from "discord.js"

export const id       = "covid19"
export const category = "info"
export const services = ["discord"]
export const args     = [[], ["country/state"]]

export default async function covid19Cmd(message, bot) {
  let countries = []
  let states    = []
  let news      = []
  const data    = await fetch("https://corona.lmao.ninja/all")?.then(res => res.json())
  
  if (message.command.args.length > 0) {
    countries = await fetch("https://corona.lmao.ninja/countries")?.then(res => res.json())
    states    = await fetch("https://corona.lmao.ninja/states")?.then(res => res.json())
  } else {
    news = await fetch("https://www.reddit.com/live/14d816ty1ylvo/.json")?.then(res => res.json())
  }

  if (message.command.args.length <= 0) {
    message.output = new RichEmbed()
  
    message.output.setColor(bot.settings.color)
    message.output.setAuthor("Latest COVID-19 stats and news")

    message.output.addField("Cases",     data.cases.toLocaleString(),     true)
    message.output.addField("Deaths",    data.deaths.toLocaleString(),    true)
    message.output.addField("Recovered", data.recovered.toLocaleString(), true)

    const stories = news.data.children.filter((item) => item.data?.mobile_embeds?.length > 0)

    for (let i = 0; i < 5; i++) {
      message.output.addField(
        stories[i].data.mobile_embeds[0]?.title,
        stories[i].data.mobile_embeds[0]?.description + '\n' + stories[i].data.mobile_embeds[0]?.original_url
      )
    }

    message.output.setTimestamp(data.updated)
    message.output.setFooter("Data provided by worldometers.info/coronavirus\nNews provided by reddit.com/live/14d816ty1ylvo")
  
  } else {
    let location            = countries.find(country => country.country.toLowerCase() == message.command.args.join(' ').toLowerCase()) 
    if (!location) location = states.find(state      => state.state.toLowerCase()     == message.command.args.join(' ').toLowerCase())
    if (!location) return message

    const countryInfo = location.countryInfo || countries.find(country => country.countryInfo.iso3 == "USA").countryInfo

    message.output = new RichEmbed()
  
    message.output.setColor(bot.settings.color)
    message.output.setAuthor(`Latest COVID-19 stats for ${location.country || location.state}`, countryInfo.flag, 'https://worldometers.info/coronavirus')

    message.output.addField("Cases",             location.cases?.toLocaleString()              || "Unknown", true)
    message.output.addField("Active",            location.active?.toLocaleString()             || "Unknown", true)
    message.output.addField("Critical",          location.critical?.toLocaleString()           || "Unknown", true)
    message.output.addField("Deaths",            location.deaths?.toLocaleString()             || "Unknown", true)
    message.output.addField("Deaths today",      location.todayDeaths?.toLocaleString()        || "Unknown", true)
    message.output.addField("Recovered",         location.recovered?.toLocaleString()          || "Unknown", true)
    message.output.addField("Cases today",       location.todayCases?.toLocaleString()         || "Unknown", true)
    message.output.addField("Cases per million", location.casesPerOneMillion?.toLocaleString() || "Unknown", true)

    message.output.setTimestamp(data.updated)
    message.output.setFooter("Data provided by worldometers.info")
  }

  return message

}