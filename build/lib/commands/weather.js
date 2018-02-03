'use strict';

var _require = require('util'),
    promisify = _require.promisify;

async function weather(message) {
  var weatherjs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('weather-js');


  if (!message.args.length) {
    message.output = 'Missing arguments, use !weather [location]';
  } else {
    var weatherData = await promisify(weatherjs.find)({ search: message.args.join(' '), degreeType: 'C' });
    var current = weatherData[0].current;
    var forecast = weatherData[0].forecast;

    message.output = '**' + weatherData[0].location.name + ' right now:**\n' + current.temperature + '\xB0C/' + Math.floor(current.temperature * 1.8 + 32) + '\xB0F ' + current.skytext + ' feels like ' + current.feelslike + '\xB0C/' + Math.floor(current.feelslike * 1.8 + 32) + '\xB0F ' + current.winddisplay + ' wind\n**Forecast for tomorrow:**\nHigh: ' + forecast[1].high + '\xB0C/' + Math.floor(forecast[1].high * 1.8 + 32) + '\xB0F, low: ' + forecast[1].low + '\xB0C/' + Math.floor(forecast[1].low * 1.8 + 32) + '\xB0F ' + forecast[1].skytextday + ' with ' + forecast[1].precip + '% chance precip.';

    message.isCode = true;
  }

  return message;
}

module.exports = weather;