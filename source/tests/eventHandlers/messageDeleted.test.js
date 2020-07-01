import assert from "assert"
import sinon  from "sinon"

import messageDeleted from "../../bot/eventHandlers/messageDeleted"
import * as saveData from  "../../bot/utils/saveData"

describe("eventHandlers/messageDeleted()", function() {

  let bot

  before(function() {
    bot = {
      data: {
        cachedMessages: [
          {messageID: "foo", channelID: "bar"}
        ]
      }
    }

    sinon.stub(saveData, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("Should removed cached messages", function() {
    messageDeleted("foobar", {id: "foo", channel: {id: "bar"}}, bot)
    messageDeleted("foobar", {id: "foo", channel: {id: "baz"}}, bot)
    messageDeleted("foobar", {id: "baz", channel: {id: "baz"}}, bot)
    messageDeleted("foobar", {id: "bar", channel: {id: "foo"}}, bot)

    assert.deepEqual(bot.data.cachedMessages, [])
    assert.deepEqual(saveData.default.args, [[bot.data]])
  })

})