import assert from "assert"
import sinon  from "sinon"

import disconnected from "../../bot/eventHandlers/disconnected"
import * as log     from "../../bot/utils/log"

describe("eventHandlers/disconnected()", function() {

  const bot = {
    discord: {
      login: sinon.spy()
    }
  }

  before(function() {
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should log connections", function() {
    disconnected("foobar", bot)

    assert(bot.discord.login.args.length <= 0)
    assert.deepEqual(log.default.args, [
      [{
        label:   "foobar",
        message: "disconnected"
      }]
    ])
  })

  describe("Discord", function() {

    it("should attempt to reconnect", function() {
      disconnected("discord", bot)

      assert.deepEqual(bot.discord.login.args[0], ["foo"])
    })

  })

})