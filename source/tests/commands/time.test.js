import assert from "assert"
import sinon  from "sinon"
import moment from "moment-timezone"
import * as fetch from "node-fetch"

import deepCopy  from "../../bot/utils/deepCopy"
import * as timeCmd from "../../bot/commands/time"

describe("commands/time()", function() {

  const format = sinon.spy(() => "foobar")

  const bot = {
    settings: {
      prefix: "??"
    },
    profiles: [
      {
        service:  "quux",
        id:       1234,
        location: "foo bar"
      }
    ]
  }

  async function fakeFetch(url) {
    if (url == "https://maps.googleapis.com/maps/api/geocode/json?key=corge&address=foo%20bar") {
      return {
        json: () => ({
          results: [
            {
              geometry: {
                location: {
                  lat: 12.345,
                  lng: 67.89
                }
              }
            }
          ]
        })
      }
    } else if (url == "https://maps.googleapis.com/maps/api/timezone/json?key=corge&location=12.345,67.89&timestamp=0&sensor=false") {
      return {
        json: () => ({
          timeZoneId: "qux"
        })
      }
    } else {
      throw new Error("quux")
    }

  }

  before(function() {
    sinon.stub(Date, "now").returns(1234)
    sinon.stub(moment, "utc").returns({format})
    sinon.stub(moment, "tz").returns({format})
    sinon.stub(fetch, "default").callsFake(fakeFetch)
  })

  after(function() {
    sinon.restore()
  })

  afterEach(function() {
    Date.now.resetHistory()
    moment.utc.resetHistory()
    moment.tz.resetHistory()
    fetch.default.resetHistory()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(timeCmd, {
      id:           "time",
      category:     "info",
      services:     ["discord", "twitchIRC"],
      args:         [
        [],
        ["<location>"],
        ["@username"]
      ],
      isRestricted: false,
      default:      timeCmd.default
    })
  })

  it("should output the current UTC time", async function() {
    const message = await timeCmd.default({
      service: "quux",
      author: {
        id: 5678
      },
    }, bot)

    assert(moment.utc.calledOnce)
    assert(!moment.tz.called)
    assert.equal(format.args[0][0], "LLLL z")
    assert.deepEqual(message, {
      service: "quux",
      author: {
        id: 5678
      },
      output: "`foobar`"
    })
  })

  it("should output the time for a given location", async function() {
    const messages = []

    messages[0] = await timeCmd.default({
      service: "quux",
      author: {
        id: 1234
      }, 
      command: {
        args: ["foo", "bar"]
      }
    }, bot)

    messages[1] = await timeCmd.default({
      service: "quux",
      author: {
        id: 1234
      },
      command: {
        args: ["baz"]
      }
    }, bot)

    assert(!moment.utc.called)
    assert.equal(fetch.default.args[0][0], "https://maps.googleapis.com/maps/api/geocode/json?key=corge&address=foo%20bar")
    assert.equal(fetch.default.args[1][0], "https://maps.googleapis.com/maps/api/timezone/json?key=corge&location=12.345,67.89&timestamp=0&sensor=false")
    assert.deepEqual(moment.tz.args[0], [1234, "qux"])
    assert.deepEqual(messages[0], {
      service: "quux",
      author: {
        id: 1234
      },
      command: {
        args: ["foo", "bar"]
      },
      output: "`foobar qux`"
    })
    assert.deepEqual(messages[1], {
      service: "quux",
      author: {
        id: 1234
      },
      command: {
        args: ["baz"]
      },
      output: "Something went wrong 😱\nI was unable to fetch the time for you"
    })
  })

  it("should output the time for the author", async function() {
    const messages = []
    const expected = []

    messages[0] = await timeCmd.default({
      service: "quux",
      author: {
        id: 1234,
        username: "quuz"
      }
    }, bot)
    
    messages[1] = await timeCmd.default({
      service: "quux",
      author: {
        id: 5678
      }
    }, bot)
  
    expected[0] = deepCopy(messages[0], {
      output: "It's `foobar` for quuz"
    })
    
    expected[1] = deepCopy(messages[1], {
      output: "`foobar`"
    })
    
    assert(moment.utc.calledOnce)
    assert.equal(fetch.default.args[0][0], "https://maps.googleapis.com/maps/api/geocode/json?key=corge&address=foo%20bar")
    assert.equal(fetch.default.args[1][0], "https://maps.googleapis.com/maps/api/timezone/json?key=corge&location=12.345,67.89&timestamp=0&sensor=false")
    assert.deepEqual(moment.tz.args[0], [1234, "qux"])
    assert.deepEqual(messages, expected)
  })

  it("should output the time for a mentioned user", async function() {
    const messages = []
    const expected = []

    messages[0] = await timeCmd.default({
      service: "quux",
      author: {
        id: 5678
      },
      mentions: [
        {
          id: 1234,
          username: "corge"
        }
      ]
    }, bot)

    messages[1] = await timeCmd.default({
      service: "quux",
      author: {
        id: 5678
      },
      mentions: [
        {
          id: 1111
        }
      ]
    }, bot)

    expected[0] = deepCopy(messages[0], {
      output: "It's `foobar` for corge"
    })
    
    expected[1] = deepCopy(messages[1], {
      output: "I don't have a location set for that user",
      isReply: true
    })

    assert.deepEqual(messages, expected)

  })

})