"use strict";

async function ping(message) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date;


  message.output = date.now() - message.timestamp + "ms";

  // TODO
  // - Add ping time for argument url

  return message;
}

module.exports = ping;