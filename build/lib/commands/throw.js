'use strict';

async function throwCmd(message) {

  if (!message.args.length) {
    message.output = 'Missing arguments, use !throw [string]';
  } else {
    message.output = '(\u256F\xB0\u25A1\xB0\uFF09\u256F\uFE35 ' + message.args.join(' ');
  }

  return message;
}

module.exports = throwCmd;