'use strict';

function connected(serviceID) {
  var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env;
  var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : console.log;
  var services = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('../services.js');
  var state = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('../state.js');


  log(serviceID + ' connected');

  state[serviceID].online = true;

  switch (serviceID) {
    case 'discord':
      state.discord.username = services.discord.user.username.toLowerCase();
      break;

    case 'twitchIRC':
      services.twitchIRC.channel('#' + env.TWITCH_CHANNEL).join();
      state.twitchIRC.username = env.TWITCH_IRC_USERNAME;
      break;
  }
}

module.exports = connected;