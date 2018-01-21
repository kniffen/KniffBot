'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');

chai.use(spies);

var kniffbot = require('../lib/kniffbot.js');

describe('kniffbot()', function () {
  var env = void 0,
      services = void 0;

  var config = {};
  var req = chai.spy();

  var dotenv = {
    config: chai.spy()
  };

  var DiscordJS = {
    Client: function Client() {
      _classCallCheck(this, Client);

      this.login = chai.spy();
    }
  };

  var IRC = {
    Client: function Client() {
      _classCallCheck(this, Client);

      this.connect = chai.spy();
    }
  };

  var Cleverbot = function Cleverbot() {
    _classCallCheck(this, Cleverbot);

    this.configure = chai.spy();
  };

  var log = chai.spy();
  var loadState = chai.spy();

  beforeEach(function () {
    env = {
      DISCORD_TOKEN: undefined,
      TWITCH_IRC_USERNAME: undefined,
      TWITCH_IRC_TOKEN: undefined,
      TWITCH_CHANNEL: undefined,
      CLEVERBOT_KEY: undefined
    };

    services = {
      discord: undefined,
      twitchIRC: undefined,
      cleverbot: undefined
    };
  });

  it('should attempt to set up the bot without issues', function () {
    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState);

    expect(dotenv.config).to.have.been.called();
    expect(log).to.have.been.called.with('Missing Discord token');
    expect(log).to.have.been.called.with('Missing Twitch IRC username, token and/or channel');
    expect(log).to.have.been.called.with('Missing Cleverbot API key');
    expect(req).to.have.been.called.with('./events.js');
    expect(services).to.deep.equal({
      discord: undefined,
      twitchIRC: undefined,
      cleverbot: undefined
    });
  });

  it('should set up Discord', function () {
    env.DISCORD_TOKEN = 'foobar';

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState);

    expect(services.discord.login).to.have.been.called.with('foobar');
  });

  it('should set up TwitchIRC', function () {
    env.TWITCH_IRC_USERNAME = 'foo';
    env.TWITCH_IRC_TOKEN = 'bar';
    env.TWITCH_CHANNEL = 'qux';

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState);

    expect(services.twitchIRC.connect).to.have.been.deep.called.with({
      host: 'irc.chat.twitch.tv',
      port: 6667,
      nick: 'foo',
      password: 'bar',
      auto_reconnect: true,
      auto_reconnect_wait: 4000,
      auto_reconnect_max_retries: 10
    });
  });

  it('should set up Cleverbot', function () {
    env.CLEVERBOT_KEY = 'foobar';

    kniffbot(config, req, env, dotenv, DiscordJS, IRC, Cleverbot, services, log, loadState);

    expect(services.cleverbot.configure).to.have.been.deep.called.with({ botapi: 'foobar' });
  });
});