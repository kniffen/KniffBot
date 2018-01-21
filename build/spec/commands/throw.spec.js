'use strict';

var _require = require('chai'),
    expect = _require.expect;

var throwCmd = require('../../lib/commands/throw.js');

describe('commands/throwCmd()', function () {

  it('should throw given arguments', async function () {
    var message = await throwCmd({ args: ['foo', 'bar'] });

    expect(message).to.deep.equal({
      args: ['foo', 'bar'],
      output: '(╯°□°）╯︵ foo bar'
    });
  });

  it('should return a specific error string if missing arguments', async function () {
    var message = await throwCmd({ args: [] });

    expect(message).to.deep.equal({
      args: [],
      output: 'Missing arguments, use !throw [string]'
    });
  });
});