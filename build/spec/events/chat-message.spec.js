'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');

chai.use(spies);

var chatMessage = require('../../lib/events/chat-message.js');

describe('events/chatMessage()', function () {
  var services = {
    cleverbot: {
      write: chai.spy(function (input, cb) {
        return cb({ message: 'hi' });
      })
    }
  };

  var state = {
    foobar: {
      username: 'barfoo'
    },
    commands: {
      foo: 'bar',
      bar: async function bar(message) {
        return Object.assign(message, { output: 'baz' });
      }
    }
  };

  var sendMessage = chai.spy();

  it('should run static commands', async function () {
    var parseMessage = chai.spy(function () {
      return {
        input: '!foo',
        command: 'foo'
      };
    });

    await chatMessage('foobar', {}, services, state, parseMessage, sendMessage);

    expect(parseMessage).to.have.been.called.with('foobar', {});
    expect(sendMessage).to.have.been.called.with({
      input: '!foo',
      command: 'foo',
      output: 'bar'
    });
  });

  it('should run logic commands', async function () {
    var parseMessage = chai.spy(function () {
      return {
        input: '!bar',
        command: 'bar'
      };
    });

    await chatMessage('foobar', {}, services, state, parseMessage, sendMessage);

    expect(parseMessage).to.have.been.called.with('foobar', {});
    expect(sendMessage).to.have.been.called.with({
      input: '!bar',
      command: 'bar',
      output: 'baz'
    });
  });

  it('should handle bot being mentioned', async function () {
    var parseMessage = chai.spy(function () {
      return {
        input: '@barfoo hello'
      };
    });

    await chatMessage('foobar', {}, services, state, parseMessage, sendMessage);

    expect(parseMessage).to.have.been.called.with('foobar', {});
    expect(services.cleverbot.write).to.have.been.called.with('hello');
    expect(sendMessage).to.have.been.called.with({
      input: '@barfoo hello',
      output: 'hi',
      isReply: true
    });
  });
});