const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')

chai.use(spies)

const kniffbot = require('../lib/kniffbot.js')

describe('kniffbot()', () => {
  let env, services

  const config = {}
  const req = chai.spy()
  
  const dotenv = {
    config: chai.spy()
  }
  
  const DiscordJS = {
    Client: class {
      constructor() {
        this.login = chai.spy()
      }
    }
  }

  const IRC = {
    Client: class {
      constructor() {
        this.connect = chai.spy()
      }
    }
  }
  
  class Cleverbot {
    constructor() {
      this.configure = chai.spy()
    }
  }

  const log = chai.spy()
  const loadState = chai.spy()

  beforeEach(() => {
    env = {
      DISCORD_TOKEN: undefined,
      TWITCH_IRC_USERNAME: undefined,
      TWITCH_IRC_TOKEN: undefined,
      TWITCH_CHANNEL: undefined,
      CLEVERBOT_KEY: undefined
    }
    
    services = {
      discord: undefined,
      twitchIRC: undefined,
      cleverbot: undefined
    }
  })

  it('should attempt to set up the bot without issues', () => {
    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState)

    expect(dotenv.config).to.have.been.called()
    expect(log).to.have.been.called.with('Missing Discord token')
    expect(log).to.have.been.called.with('Missing Twitch IRC username, token and/or channel')
    expect(log).to.have.been.called.with('Missing Cleverbot API key')
    expect(req).to.have.been.called.with('./events.js')
    expect(services).to.deep.equal({
      discord: undefined,
      twitchIRC: undefined,
      cleverbot: undefined,
    })
  })

  it('should set up Discord', () => {
    env.DISCORD_TOKEN = 'foobar'

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState)

    expect(services.discord.login).to.have.been.called.with('foobar')
  })
  
  it('should set up TwitchIRC', () => {
    env.TWITCH_IRC_USERNAME = 'foo'
    env.TWITCH_IRC_TOKEN = 'bar'
    env.TWITCH_CHANNEL = 'qux'

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState)

    expect(services.twitchIRC.connect).to.have.been.deep.called.with({
      host: 'irc.chat.twitch.tv',
      port: 6667,
      nick: 'foo',
      password: 'bar',
      auto_reconnect: true,
      auto_reconnect_wait: 4000,
      auto_reconnect_max_retries: 10
    })
  })
  
  it('should set up Cleverbot', () => {
    env.CLEVERBOT_KEY = 'foobar'

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState)

    expect(services.cleverbot.configure).to.have.been.deep.called.with({botapi: 'foobar'})
  })
})