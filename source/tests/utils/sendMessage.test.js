import assert from "assert"
import sinon  from "sinon"

import sendMessage from "../../bot/utils/sendMessage"

describe("utils/sendMessage()", function() {
  
  const say = sinon.spy()

  const bot = {
    twitchIRC: {
      channel: sinon.spy(() => ({say}))
    }
  }

  beforeEach(function() {
    sinon.reset()
  })

  it("should send Discord messages", function() {
    const message = {
      service: "discord",
      original: {
        channel: {
          send: sinon.spy()
        },
        reply: sinon.spy()
      },
      output: "foo bar"
    }

    sendMessage(message, bot)

    message.isReply = true
    sendMessage(message, bot)

    message.isFile = true
    sendMessage(message, bot)

    assert.equal(message.original.channel.send.args[0][0], message.output)
    assert.equal(message.original.reply.args[0][0], message.output)
    assert.deepEqual(message.original.channel.send.args[1], ['', {files: [message.output]}])
    
  })

  it("should send Twitch IRC messages", function() {
    const message = {
      service: "twitchIRC",
      output: "foo bar",
      author: {
        username: "foobar"
      }
    }

    sendMessage(message, bot)

    message.isReply = true
    sendMessage(message, bot)
    
    assert.equal(bot.twitchIRC.channel.args[0][0], "#qux")
    assert.equal(bot.twitchIRC.channel.args[1][0], "#qux")
    assert.equal(say.args[0][0], "foo bar")
    assert.equal(say.args[1][0], "@foobar foo bar")
  })

})