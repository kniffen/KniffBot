'use strict';

async function nextEvent(message) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('../state.js');
  var updateEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('../utils/update-events.js');


  await updateEvents();

  if (!state.events.length) {
    message.output = 'There are currently no scheduled events';
  } else {
    var event = state.events[0];
    var remaining = Math.floor((event.timestamp - message.timestamp) / 60000);

    var days = Math.floor(remaining / 1440);
    var hrs = Math.floor(remaining % 1440 / 60);
    var min = Math.floor(remaining % 1440 % 60);

    message.output = event.name + ' starts in ' + (days ? days + 'd ' : '') + (hrs ? hrs + 'h ' : '') + min + 'm\n' + event.description + '\n' + event.location;
  }

  return message;
}

module.exports = nextEvent;