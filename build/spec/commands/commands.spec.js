'use strict';

var _require = require('chai'),
    expect = _require.expect;

var commands = require('../../lib/commands/commands.js');

describe('commands/commands()', function () {

  var state = {
    commands: {
      foo: 'bar',
      baz: function baz() {
        return undefined;
      }
    }
  };

  it('should return a list of available commands', async function () {
    var message = await commands({}, state);

    expect(message).to.deep.equal({
      output: '!foo !baz',
      isCode: true
    });
  });
});