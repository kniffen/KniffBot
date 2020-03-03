import assert from "assert"
import sinon  from "sinon"

import messageEventHandler from "../../bot/eventHandlers/message"
import commands            from "../../bot/commands"
import * as parseMessage   from "../../bot/utils/parseMessage"
import * as sendMessage    from "../../bot/utils/sendMessage"

describe("eventHandlers.message()", function() {

  before(function() {
    sinon.stub(parseMessage, "default")
    sinon.stub(sendMessage,  "default")
  })
  
  beforeEach(function() {
    parseMessage.default.resetHistory()
    sendMessage.default.resetHistory()

    parseMessage.default.callsFake(() => ({}))
    sendMessage.default.callsFake(() => {})
  })

  after(function() {
    sinon.restore()
  })

  it("should handle messages", async function() {
    await messageEventHandler("foobar", "foo", "bar")

    assert(parseMessage.default.calledOnce)
    assert(!sendMessage.default.called)
    assert.deepEqual(parseMessage.default.args[0], ["foobar", "foo", "bar"])
  })

  describe("commands", function() {

    it("should ignore commands from bots", async function() {
      parseMessage.default.callsFake(() => ({
        command: {id: "ping"},
        isBot: true
      }))

      await messageEventHandler("foobar", "foo", "bar")

      assert(!sendMessage.default.called)
    })


    it("should run commands", async function() {
      parseMessage.default.callsFake(() => ({
        command: {id: "ping"}
      }))

      await messageEventHandler("discord", "foo", "bar")

      assert(sendMessage.default.calledOnce)
      assert.deepEqual(sendMessage.default.args[0], [{
        command: {id: "ping"},
        output:  "pong!"
      }, "bar"])
    })

    it("should only run commands if the service is allowed", async function() {
      parseMessage.default.callsFake(() => ({
        command: {id: "ping"}
      }))

      await messageEventHandler("foobar", "foo", "bar")
      
      assert(!sendMessage.default.called)
    })

    it("should handle non existing commands", async function() {
      parseMessage.default.callsFake(() => ({
        command: {id: "bar"}
      }))

      await messageEventHandler("discord", "foo", "bar")
      
      assert(!sendMessage.default.called)
    })

  })

  describe("mentions", async function() {
    const bot = {
      cleverbot: {
        write: sinon.spy((input, cb) => cb({message: "foo bar baz"}))
      }
    }

    it("should ignore mentions from bots", async function() {
      parseMessage.default.callsFake(() => ({
        isMentioned: true,
        isBot: true,
      }))

      await messageEventHandler("foobar", "foo", bot)
    
      assert(!bot.cleverbot.write.called)
      assert(!sendMessage.default.called)
    })

    it("should reply to mentions and direct messages with cleverbot", async function() {
      parseMessage.default.callsFake(() => ({
        cleanInput: "@fOo foo bar?",
        isMentioned: true,
        self: {username: "Foo"}
      }))

      await messageEventHandler("foobar", "foo", bot)

      parseMessage.default.callsFake(() => ({
        cleanInput: "@fOo foo bar?",
        isDM: true,
        self: {username: "Foo"}
      }))

      await messageEventHandler("foobar", "foo", bot)

      assert.equal(bot.cleverbot.write.args[0][0], "foo bar?")
      assert.equal(bot.cleverbot.write.args[1][0], "foo bar?")
      assert.deepEqual(sendMessage.default.args, [
        [
          {
            cleanInput:  "@fOo foo bar?",
            output:      "foo bar baz",
            isMentioned: true,
            isReply:     true,
            self:        {username: "Foo"}
          },
          bot
        ],
        [
          {
            cleanInput:  "@fOo foo bar?",
            output:      "foo bar baz",
            isDM:        true,
            isReply:     true,
            self:        {username: "Foo"}
          },
          bot
        ]
      ])
    })

    it("should reply with a fallback message if cleverbot is unresponsive", async function() {
      const botFails = {
        cleverbot: {
          write: (input, cb) => {
            throw new Error("error")
          }
        }
      }

      parseMessage.default.callsFake(() => ({
        cleanInput: "@fOo foo bar?",
        isMentioned: true,
        self: {username: "Foo"}
      }))

      await messageEventHandler("foobar", "foo", botFails)

      assert.deepEqual(sendMessage.default.args, [[{
        cleanInput:  "@fOo foo bar?",
        output:      "I'm sorry, can you repeat that?",
        isMentioned: true,
        isReply:     true,
        self:        {username: "Foo"}
      }, botFails]])
    })

    it("should handle cleverbot not existing", async function() {
      parseMessage.default.callsFake(() => ({
        cleanInput: "@fOo foo bar?",
        isMentioned: true,
        self: {username: "Foo"}
      }))

      await messageEventHandler("foobar", "foo", {})
    })
  })
})