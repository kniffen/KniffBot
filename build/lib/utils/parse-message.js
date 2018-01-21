'use strict';

function parseMessage(serviceID, data) {
  var message = void 0;

  switch (serviceID) {
    case 'discord':
      message = {
        serviceID: serviceID,
        input: data.cleanContent,
        id: data.id,
        timestamp: data.createdTimestamp,
        author: data.author,
        fullMessage: data
      };
      break;

    case 'twitchIRC':
      message = {
        serviceID: serviceID,
        input: data.message,
        author: {
          username: data.ident
        },
        timestamp: data.time
      };
      break;
  }

  if (message.input[0] == '!') {
    message.args = message.input.split(' ');
    message.command = message.args[0].substring(1).toLowerCase();
    message.args.shift();
  }

  return message;
}

module.exports = parseMessage;