'use strict';

async function commands(message) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('../state.js');


  message.output = Object.keys(state.commands).map(function (key) {
    return '!' + key;
  }).join(' ');
  message.isCode = true;

  return message;
}

module.exports = commands;