'use strict';

var _require = require('chai'),
    expect = _require.expect;

var loadState = require('../../lib/utils/load-state.js');

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

  loadState(config, req, state, fs, path);

  it('should load config.json into the state', function () {
    expect(state).to.deep.equal({
      timezone: 'foobar',
      timeformat: 'barfoo',
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
  });
});