'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');

chai.use(spies);

var connected = require('../../lib/events/connected.js');

describe('events/connected()', function () {
  var state = void 0;

  var env = {
    TWITCH_CHANNEL: 'foobar',
    TWITCH_IRC_USERNAME: 'barfoo'
  };

  var log = chai.spy();

  var join = chai.spy();

  var services = {
    discord: {
      user: {
        username: 'barfoo'
      }
    },
    twitchIRC: {
      channel: chai.spy(function () {
        return { join: join };
      })
    }
  };

  beforeEach(function () {
    state = {
      discord: { online: false },
      twitchIRC: { online: false }
    };
  });

  it('should handle Discord connections', function () {
    connected('discord', env, log, services, state);

    expect(log).to.have.been.called.with('discord connected');
    expect(state.discord).to.be.deep.equal({
      online: true,
      username: 'barfoo'
    });
  });

  it('should handle Twitch IRC connections', function () {
    connected('twitchIRC', env, log, services, state);

    expect(log).to.have.been.called.with('twitchIRC connected');
    expect(state.twitchIRC).to.be.deep.equal({
      online: true,
      username: 'barfoo'
    });
    expect(services.twitchIRC.channel).to.have.been.called.with('#foobar');
    expect(join).to.have.been.called();
  });
});