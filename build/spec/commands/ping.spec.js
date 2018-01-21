'use strict';

var _require = require('chai'),
    expect = _require.expect;

var ping = require('../../lib/commands/ping.js');

describe('commands/ping()', function () {
  var date = {
    now: function now() {
      return 150;
    }
  };

  it('should return the current ping time to the service', async function () {
    var message = await ping({ timestamp: 50 }, date);

    expect(message).to.deep.equal({
      timestamp: 50,
      output: '100ms'
    });
  });
});