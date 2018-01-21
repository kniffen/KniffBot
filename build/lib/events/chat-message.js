'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

async function chatMessage(serviceID, data) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('../services.js'),
      cleverbot = _ref.cleverbot;

  var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('../state.js');
  var parseMessage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('../utils/parse-message.js');
  var sendMessage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : require('../utils/send-message.js');


  var message = parseMessage(serviceID, data);

  if (message.command && state.commands[message.command]) {
    switch (_typeof(state.commands[message.command])) {
      case 'string':
        message.output = state.commands[message.command];
        break;

      case 'function':
        message = await state.commands[message.command](message);
        break;
    }
  } else if (message.input.toLowerCase().includes('@' + state[serviceID].username)) {
    var cleanInput = message.input.split(' ').filter(function (word) {
      return word.toLowerCase() != '@' + state[serviceID].username;
    }).map(function (word) {
      return word.split('@').join('');
    }).join(' ');

    message.output = await new Promise(function (resolve) {
      cleverbot.write(cleanInput, function (answer) {
        return resolve(answer.message);
      });
    });
    message.isReply = true;
  }

  if (message.output) sendMessage(message);
}

module.exports = chatMessage;