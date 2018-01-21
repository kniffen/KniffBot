'use strict';

function sendMessage(_ref) {
  var serviceID = _ref.serviceID,
      output = _ref.output,
      isCode = _ref.isCode,
      isReply = _ref.isReply,
      isFile = _ref.isFile,
      author = _ref.author,
      fullMessage = _ref.fullMessage;
  var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env;

  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('../services.js'),
      twitchIRC = _ref2.twitchIRC;

  switch (serviceID) {
    case 'discord':
      if (isFile) {
        fullMessage.channel.send('', { files: [output] });
      } else if (isReply) {
        fullMessage.reply(output);
      } else if (isCode) {
        fullMessage.channel.send(output, { code: true });
      } else {
        fullMessage.channel.send(output);
      }
      break;

    case 'twitchIRC':
      if (isReply) {
        twitchIRC.channel('#' + env.TWITCH_CHANNEL).say('@' + author.username + ' ' + output);
      } else {
        twitchIRC.channel('#' + env.TWITCH_CHANNEL).say(output);
      }
      break;
  }
}

module.exports = sendMessage;