/**
  * KniffBot
  *
  * A bot aimed to work with multiple APIs at once, but mainly Discord
  *
  * MIT License | Copyright (c) 2018-2020 Kniffen
  */

require("dotenv-flow").config()

import path              from "path"
import fs                from "fs"
import DiscordJS         from "discord.js"
import IRC               from "irc-framework"
import Cleverbot         from "cleverbot-node"
import { WolframClient } from "node-wolfram-alpha"

import log from "./utils/log"

import errorEventHandler        from "./eventHandlers/error"
import connectedEventHandler    from "./eventHandlers/connected"
import disconnectedEventHandler from "./eventHandlers/disconnected"
import messageEventHandler      from "./eventHandlers/message"


try {

  /**
    * Default bot properties
    * Various APIs and data
    */
  const bot = {
    discord: null,
    twitchIRC: null,
    cleverbot: null,
    wolframAlpha: null,
    data: {
      settings: {
        prefix: '!',
        color: 0xFF0000
      },
      profiles: [],
      cachedMessages: []
    }
  }

  // load saved data
  const savedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data.json")))

  if (savedData)
    bot.data = Object.assign(bot.data, savedData)

  // Setup Discord
  if (process.env.DISCORD_TOKEN) {
    bot.discord = new DiscordJS.Client()

    bot.discord.on("error",        (error) => errorEventHandler("discord", error))  
    bot.discord.on("ready",        ()      => connectedEventHandler("discord"))  
    bot.discord.on("disconnected", ()      => disconnectedEventHandler("discord", bot))  
    bot.discord.on("message",      (data)  => messageEventHandler("discord", data, bot))
  } else {
    log({
      label:   "Discord",
      message: "Missing token",
      isError: true
    })
  }

  // Setup Twitch IRC
  if (process.env.TWITCH_IRC_USERNAME
   && process.env.TWITCH_IRC_TOKEN
   && process.env.TWITCH_CHANNEL
  ) {
    bot.twitchIRC = new IRC.Client()

    bot.twitchIRC.on("registered",   () => connectedEventHandler("twitchIRC"))
    bot.twitchIRC.on("message",  (data) => messageEventHandler("twitchIRC", data, bot))
  } else {
    log({
      label:  "Twitch IRC",
      message: "Missing username, token and/or channel",
      isError: true
    })
  }

  // Setup Cleverbot
  if (process.env.CLEVERBOT_API_KEY) {
    bot.cleverbot = new Cleverbot()
  } else {
    log({
      label:   "Cleverbot",
      message: "Missing API key",
      isError: true
    })
  }

  // Setup Wolfram|Alpha
  if (process.env.WOLFRAM_ALPHA_APP_ID) {
    bot.wolframAlpha = new WolframClient(process.env.WOLFRAM_ALPHA_APP_ID)
  } else {
    log({
      label:   "Wolfram|Alpha",
      message: "Missing app ID",
      isError: true
    })
  }

  // Login
  if (bot.discord)
    bot.discord.login(process.env.DISCORD_TOKEN)

  if (bot.twitchIRC) {
    bot.twitchIRC.connect({
      host:                       "irc.chat.twitch.tv",
      port:                       6667,
      nick:                       process.env.TWITCH_IRC_USERNAME,
      password:                   process.env.TWITCH_IRC_TOKEN,
      auto_reconnect:             true,
      auto_reconnect_wait:        4000,
      auto_reconnect_max_retries: 10
    })
  }

  if (bot.cleverbot)
    bot.cleverbot.configure({botapi: process.env.CLEVERBOT_API_KEY})

} catch (err) {

  console.log(err)

  console.log("There was a problem setting up the bot, please make sure your environment variables and settings are correct.")

}