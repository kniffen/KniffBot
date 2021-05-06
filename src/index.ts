require("dotenv-flow").config()

import discord from './services/discord'
import twitchIRC from './services/twitchIRC'
import cleverbot from './services/cleverbot'

if (discord) {
  discord.login(process.env.DISCORD_TOKEN)
}

if (twitchIRC) {
  twitchIRC.connect({
    host: 'irc.chat.twitch.tv',
    port: 6667,
    nick: process.env.TWITCH_IRC_USERNAME,
    password: process.env.TWITCH_IRC_TOKEN,
    auto_reconnect: true,
    auto_reconnect_wait: 4000,
    auto_reconnect_max_retries: 10
  })
}

if (cleverbot) {
  cleverbot.configure({botapi: process.env.CLEVERBOT_API_KEY})
}