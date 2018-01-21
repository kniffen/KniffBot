'use strict';

var _require = require('chai'),
    expect = _require.expect;

var eightBall = require('../../lib/commands/8ball.js');

describe('commands/8ball', function () {

  it('should return a random answer', async function () {
    var result = await eightBall({
      args: ['foo']
    });

    expect(result.args).to.deep.equal(['foo']);
    expect(result.output).to.be.a('string');
    expect(result.isReply).to.be.true;
  });

  it('should return a specific error string if missing arguments', async function () {
    var result = await eightBall({
      args: []
    });

    expect(result).to.deep.equal({
      args: [],
      output: 'Missing arguments, use !8ball [question]'
    });
  });
});