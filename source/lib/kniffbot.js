async function kniffbot (
  config,
  req = require,
  env = process.env,
  dotenv = require('dotenv'),
  DiscordJS = require('discord.js'),
  IRC = require('irc-framework'),
  Cleverbot = require('cleverbot-node'),
  services = require('./services.js'),
  log = console.log,
  loadState = require('./utils/load-state.js')
) {

  // Log unhandled promise rejections
  process.on('unhandledRejection', rej => log(rej, 'Promise Rejection'))

  dotenv.config()
  await loadState(config)

  if (env.DISCORD_TOKEN) {
    services.discord = new DiscordJS.Client()
  } else {
    log('Missing Discord token')
  }

  if (env.TWITCH_IRC_USERNAME && env.TWITCH_IRC_TOKEN && env.TWITCH_CHANNEL) {
    services.twitchIRC = new IRC.Client()
  } else {
    log('Missing Twitch IRC username, token and/or channel')
  }

  if (env.CLEVERBOT_KEY) {
    services.cleverbot = new Cleverbot()
    services.cleverbot.configure({botapi: env.CLEVERBOT_KEY})
  } else {
    log('Missing Cleverbot API key')
  }

  req('./events.js')

  if (services.discord)
    services.discord.login(env.DISCORD_TOKEN)

  if (services.twitchIRC)
    services.twitchIRC.connect({
      host: 'irc.chat.twitch.tv',
      port: 6667,
      nick: env.TWITCH_IRC_USERNAME,
      password: env.TWITCH_IRC_TOKEN,
      auto_reconnect: true,
      auto_reconnect_wait: 4000,
      auto_reconnect_max_retries: 10
    })
}

module.exports = kniffbot