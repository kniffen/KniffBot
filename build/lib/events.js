'use strict';

var _require = require('./services.js'),
    discord = _require.discord,
    twitchIRC = _require.twitchIRC;

var eventHandlers = {
  error: require('./events/error.js'),
  connected: require('./events/connected.js'),
  disconnected: require('./events/disconnected.js'),
  chatMessage: require('./events/chat-message.js')
};

if (discord) {
  discord.on('error', function (err) {
    return eventHandlers.error('Discord', err);
  });
  discord.on('ready', function () {
    return eventHandlers.connected('discord');
  });
  discord.on('disconnected', function () {
    return eventHandlers.disconnected('discord');
  });
  discord.on('message', function (data) {
    return eventHandlers.chatMessage('discord', data);
  });
}

if (twitchIRC) {
  twitchIRC.on('registered', function () {
    return eventHandlers.connected('twitchIRC');
  });
  twitchIRC.on('message', function (data) {
    return eventHandlers.chatMessage('twitchIRC', data);
  });
}