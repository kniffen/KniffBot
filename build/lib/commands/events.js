'use strict';

async function events(message) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('../state.js');
  var moment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('moment-timezone');
  var updateEvents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('../utils/update-events.js');


  await updateEvents();

  message.output = 'Upcoming events:\n';

  message.output += state.events.filter(function (event) {
    return event.timestamp > message.timestamp;
  }).map(function (event) {
    return '\n- ' + moment(event.timestamp).tz(state.timezone).format(state.timeformat) + '\n' + event.name + '\n' + (event.description || '');
  }).join('\n');

  message.isCode = true;

  return message;
}

module.exports = events;