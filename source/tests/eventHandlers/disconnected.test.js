import assert from "assert"
import sinon  from "sinon"

import disconnected    from "../../bot/eventHandlers/disconnected"
import * as inspector  from "../../bot/utils/inspector"
import * as log        from "../../bot/utils/log"

describe("eventHandlers/disconnected()", function() {

  let clock, bot, intervalSpy

  before(function() {
    clock = sinon.useFakeTimers()

    bot = {
      discord: {
        login: sinon.spy()
      }
    }

    sinon.stub(log, "default")

    intervalSpy = sinon.spy()

    inspector.intervals["foobar"] = setInterval(intervalSpy, 10)

    clock.tick(100)
  })

  after(function() {
    sinon.restore()
    clock.restore()
  })

  describe("Any", function() {
    before(function() {
      disconnected("foobar", bot)

      clock.tick(100)
    })

    it("should log connections", function() {

      assert(bot.discord.login.args.length <= 0)
      assert.deepEqual(log.default.args, [
        [{
          label:   "foobar",
          message: "disconnected"
        }]
      ])
    })

    it("should clear the inspector interval", function() {
      assert.equal(intervalSpy.args.length, 10)
    })
  })

  describe("Discord", function() {
    before(function() {
      disconnected("discord", bot)
    })

    it("should attempt to reconnect", function() {
      assert.deepEqual(bot.discord.login.args[0], ["foo"])
    })

  })

})