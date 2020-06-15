import assert     from "assert"
import sinon      from "sinon"
import * as fetch from "node-fetch"

import * as catCmd from "../../bot/commands/cat"

describe("commands/cat()", function() {

  afterEach(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(catCmd, {
      id:           "cat",
      category:     "fun",
      services:     ["discord", "twitchIRC"],
      args:         [[]],
      isRestricted: false,
      default:      catCmd.default
    })
  })

  it("should output a random cat image", async function() {
    sinon.stub(fetch, "default").callsFake(async () => ({
      json: () => ({file: "foo.bar"})
    }))

    const message = await catCmd.default({})

    assert.equal(fetch.default.args[0][0], "http://aws.random.cat/meow")
    assert.deepEqual(message, {
      output: "foo.bar",
      isFile: true
    })
  })

  it("should output a fallback cat image if the request failed", async function() {
    sinon.stub(fetch, "default").callsFake(fakeFetch)

    const messages = []
    let fakeFetch = async () => ({
      json: async () => ({})
    })

    messages[0] = await catCmd.default({})
    
    fakeFetch = async () => {
      throw new Error("foobar")
    }
    
    messages[1] = await catCmd.default({})

    assert.deepEqual(messages, [
      {
        output: "http://i.imgur.com/Bai6JTL.jpg",
        isFile: true
      },
      {
        output: "http://i.imgur.com/Bai6JTL.jpg",
        isFile: true
      }
    ])
  })

})