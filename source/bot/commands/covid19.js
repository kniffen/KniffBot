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
  let total, country, countryYesterday, state, stateYesterday, news

  if (message.command.args.length > 0) {
    const data = await Promise.all([
      fetch("https://corona.lmao.ninja/v2/all")?.then(res => res.json()),
      fetch("https://corona.lmao.ninja/v2/countries")?.then(res => res.json()),
      fetch("https://corona.lmao.ninja/v2/states")?.then(res => res.json())
    ])

    total   = data[0]
    country = data[1].find(country => country.country.toLowerCase() == message.command.args.join(' ').toLowerCase())

    if (!country) {
      country = data[1].find(country => country.countryInfo.iso3 == "USA")
      state   = data[2].find(state   => state.state.toLowerCase() == message.command.args.join(' ').toLowerCase())
    }

  } else {
    const data = await Promise.all([
      fetch("https://corona.lmao.ninja/v2/all")?.then(res => res.json()),
      fetch("https://www.reddit.com/live/14d816ty1ylvo/.json")?.then(res => res.json())
    ])

    total = data[0]
    news  = data[1]
  }

  if (message.command.args.length <= 0) {
    message.output = new RichEmbed()
  
    message.output.setColor(bot.settings.color)
    message.output.setAuthor("Latest COVID-19 stats and news")

    message.output.addField("Cases",     total.cases.toLocaleString(),     true)
    message.output.addField("Deaths",    total.deaths.toLocaleString(),    true)
    message.output.addField("Recovered", total.recovered.toLocaleString(), true)

    const stories = news.data.children.filter((item) => item.data?.mobile_embeds?.length > 0)

    for (let i = 0; i < 5; i++) {
      message.output.addField(
        stories[i].data.mobile_embeds[0]?.title,
        stories[i].data.mobile_embeds[0]?.description + '\n' + stories[i].data.mobile_embeds[0]?.original_url
      )
    }

    message.output.setTimestamp(total.updated)
    message.output.setFooter("Data provided by worldometers.info/coronavirus\nNews provided by reddit.com/live/14d816ty1ylvo")
  
  } else {

    const location          = state || country

    message.output = new RichEmbed()
  
    message.output.setColor(bot.settings.color)
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

    message.output.setTimestamp(total.updated)
    message.output.setFooter("Data provided by worldometers.info")
  }

  return message

}