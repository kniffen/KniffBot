'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');

chai.use(spies);

var disconnected = require('../../lib/events/disconnected.js');

describe('events/disconnected()', function () {
  var log = chai.spy();

  var env = {
    DISCORD_TOKEN: 'barfoo'
  };

  var services = {
    discord: {
      login: chai.spy()
    }
  };

  var state = {
    discord: {
      online: true
    }
  };

  disconnected('discord', log, env, services, state);

  it('should log a message to the console', function () {
    expect(log).to.have.been.called.with('discord disconnected');
  });

  it('should attempt to reconnect to the service', function () {
    expect(services.discord.login).to.have.been.called.with('barfoo');
  });

  it('should update the state of the service', function () {
    expect(state.discord.online).to.be.false;
  });
});