import assert from "assert"
import sinon  from "sinon"

import connected      from "../../bot/eventHandlers/connected"
import * as inspector from "../../bot/utils/inspector"
import * as log       from "../../bot/utils/log"

describe("eventHandlers/connected()", function() {

  let clock, bot, getSpy, fetchMessageSpy

  before(function() {
    clock = sinon.useFakeTimers()

    getSpy = sinon.spy((id) => {
      if (id == "foo") {
        return {fetchMessage: fetchMessageSpy}
      } else {

      }
    })
    
    fetchMessageSpy = sinon.spy()

    const createChannel = (hasMessage) => ({
      
    })

    bot = {
      discord: {
        channels: {
          cache: {
            array: () => [
              createChannel(true),
              createChannel(false)
            ]
          }
        }
      },
      data: {
        cachedMessages: [
          {messageID: "foo"},
          {messageID: "bar"},
        ]
      }
    }

    sinon.stub(log, "default")
    sinon.stub(inspector, "default")

    connected("foobar", bot)

    clock.tick(8.64e+7)
  })

  after(function() {
    sinon.restore()
    clock.restore()
  })

  it("should log connections", function() {
    assert.deepEqual(log.default.args[0][0],{
      label:   "foobar",
      message: "connected"
    })
  })

  it("should run the inspector on connection and once every 24 hours", function() {
    assert.deepEqual(inspector.default.args, [
      ["foobar", bot],
      ["foobar", bot]
    ])

    assert(inspector.intervals["foobar"])
  })

})