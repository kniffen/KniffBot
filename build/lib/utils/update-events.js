'use strict';

async function updateEvents() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env;
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('../state.js');
  var fetch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('node-fetch');
  var date = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Date;


  var url = 'https://www.googleapis.com/calendar/v3/calendars/' + env.GOOGLE_CALENDAR_ID + '/events?singleEvents=true&orderBy=startTime&key=' + env.GOOGLE_CALENDAR_APIKEY;
  var list = await fetch(url).then(function (data) {
    return data.json();
  });

  state.events = list.items.filter(function (element, index) {
    return index < 3;
  }).map(function (event) {
    var d = new date(event.start.dateTime || event.start.date);

    return {
      timestamp: d.getTime(),
      name: event.summary,
      description: event.description,
      location: event.location
    };
  });
}

module.exports = updateEvents;