const { promisify } = require('util')

async function weather(
  message,
  weatherjs = require('weather-js')
) {

  if (!message.args.length) {
    message.output = 'Missing arguments, use !weather [location]'
  
  } else {
    const weatherData = await promisify(weatherjs.find)({search: message.args.join(' '), degreeType: 'C'})
    const current = weatherData[0].current
    const forecast = weatherData[0].forecast

    message.output = 
`**${weatherData[0].location.name} right now:**
${current.temperature}°C/${current.temperature*1.8+32}°F ${current.skytext} feels like ${current.feelslike}°C/${current.feelslike*1.8+32}°F ${current.winddisplay} wind
**Forecast for tomorrow:**
High: ${forecast[1].high}°C/${forecast[1].high*1.8+32}°F, low: ${forecast[1].low}°C/${forecast[1].low*1.8+32}°F ${forecast[1].skytextday} with ${forecast[1].precip}% chance precip.`

    message.isCode = true

  }

  return message

}

module.exports = weather