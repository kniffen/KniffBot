'use strict';

async function time(message) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date;
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('../state.js');
  var moment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('moment-timezone');
  var fetch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('node-fetch');


  if (!message.args.length) {
    message.output = moment.tz(state.timezone).format(state.timeformat);
  } else {
    var geopath = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(message.args.join(' ').replace(/&/g, ''));
    var _results$0$geometry$l = (await fetch(geopath).then(function (res) {
      return res.json();
    })).results[0].geometry.location,
        lat = _results$0$geometry$l.lat,
        lng = _results$0$geometry$l.lng;

    var tzpath = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=0&sensor=false';
    var timezone = (await fetch(tzpath).then(function (res) {
      return res.json();
    })).timeZoneId;

    message.output = moment.tz(date.now(), timezone).format(state.timeformat) + ' ' + timezone;
  }

  message.isCode = true;

  return message;
}

module.exports = time;