'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var loadState = require('../../lib/utils/load-state.js');

chai.use(spies);

describe('utils/loadState()', function () {
  var config = {
    timezone: 'foobar',
    timeformat: 'barfoo',
    commands: {
      foo: 'bar'
    }
  };

  var req = function req() {
    return 'foobar';
  };

  var state = {
    events: [],
    discord: {
      online: false
    },
    twitchIRC: {
      online: false
    }
  };

  var fs = {
    readdirSync: function readdirSync() {
      return ['bar.js', 'baz.js'];
    }
  };

  var path = {
    resolve: function resolve() {
      return undefined;
    }
  };

  var updateEvents = chai.spy();

  loadState(config, req, state, fs, path, updateEvents);

  it('should load config.json into the state', function () {
    expect(state).to.deep.equal({
      timezone: 'foobar',
      timeformat: 'barfoo',
      events: [],
      discord: {
        online: false
      },
      twitchIRC: {
        online: false
      },
      commands: {
        foo: 'bar',
        bar: 'foobar',
        baz: 'foobar'
      }
    });

    expect(updateEvents).to.have.been.called();
  });
});