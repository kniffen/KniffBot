'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var sendMessage = require('../../lib/utils/send-message.js');

chai.use(spies);

describe('utils/sendMessage()', function () {
  var env = {
    TWITCH_CHANNEL: 'foobar'
  };

  var services = {
    twitchIRC: {
      channel: chai.spy(function () {
        return twitchIRCChannel;
      })
    }
  };

  var twitchIRCChannel = {
    say: chai.spy()
  };

  it('should send Discord messages', function () {
    var fullMessage = {
      channel: {
        send: chai.spy()
      },
      reply: chai.spy()
    };

    sendMessage({
      serviceID: 'discord',
      output: 'foo',
      fullMessage: fullMessage
    }, env, services);

    sendMessage({
      serviceID: 'discord',
      output: 'bar',
      isCode: true,
      fullMessage: fullMessage
    }, env, services);

    sendMessage({
      serviceID: 'discord',
      output: 'baz',
      isFile: true,
      fullMessage: fullMessage
    }, env, services);

    sendMessage({
      serviceID: 'discord',
      output: 'qux',
      isReply: true,
      fullMessage: fullMessage
    }, env, services);

    expect(fullMessage.channel.send).to.have.been.called.with('foo');
    expect(fullMessage.channel.send).to.have.been.called.with('bar', { code: true });
    expect(fullMessage.channel.send).to.have.been.called.with('', { files: ['baz'] });
    expect(fullMessage.reply).to.have.been.called.with('qux');
  });

  it('should send Twitch IRC messages', function () {
    sendMessage({
      serviceID: 'twitchIRC',
      output: 'foo bar baz'
    }, env, services);

    sendMessage({
      serviceID: 'twitchIRC',
      output: 'foo bar baz',
      isReply: true,
      author: {
        username: 'barfoo'
      }
    }, env, services);

    expect(services.twitchIRC.channel).to.have.been.called.with('#foobar');
    expect(twitchIRCChannel.say).to.have.been.called.with('foo bar baz');
    expect(twitchIRCChannel.say).to.have.been.called.with('@barfoo foo bar baz');
  });
});