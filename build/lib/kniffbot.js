'use strict';

async function kniffbot(config) {
  var req = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require;
  var env = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.env;
  var dotenv = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('dotenv');
  var DiscordJS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('discord.js');
  var IRC = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : require('irc-framework');
  var Cleverbot = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : require('cleverbot-node');
  var services = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : require('./services.js');
  var log = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : console.log;
  var loadState = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : require('./utils/load-state.js');


  // Log unhandled promise rejections
  process.on('unhandledRejection', function (rej) {
    return log(rej, 'Promise Rejection');
  });

  dotenv.config();
  await loadState(config);

  if (env.DISCORD_TOKEN) {
    services.discord = new DiscordJS.Client();
  } else {
    log('Missing Discord token');
  }

  if (env.TWITCH_IRC_USERNAME && env.TWITCH_IRC_TOKEN && env.TWITCH_CHANNEL) {
    services.twitchIRC = new IRC.Client();
  } else {
    log('Missing Twitch IRC username, token and/or channel');
  }

  if (env.CLEVERBOT_KEY) {
    services.cleverbot = new Cleverbot();
    services.cleverbot.configure({ botapi: env.CLEVERBOT_KEY });
  } else {
    log('Missing Cleverbot API key');
  }

  req('./events.js');

  if (services.discord) services.discord.login(env.DISCORD_TOKEN);

  if (services.twitchIRC) services.twitchIRC.connect({
    host: 'irc.chat.twitch.tv',
    port: 6667,
    nick: env.TWITCH_IRC_USERNAME,
    password: env.TWITCH_IRC_TOKEN,
    auto_reconnect: true,
    auto_reconnect_wait: 4000,
    auto_reconnect_max_retries: 10
  });
}

module.exports = kniffbot;