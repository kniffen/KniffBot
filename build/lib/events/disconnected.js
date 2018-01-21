'use strict';

function disconnected(serviceID) {
  var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.log;
  var env = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.env;
  var services = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('../services.js');
  var state = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('../state.js');


  log(serviceID + ' disconnected');

  state[serviceID].online = false;

  if (serviceID == 'discord') services.discord.login(env.DISCORD_TOKEN);
}

module.exports = disconnected;