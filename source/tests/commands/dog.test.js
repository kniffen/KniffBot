import assert     from "assert"
import sinon      from "sinon"
import * as fetch from "node-fetch"

import * as dogCmd from "../../bot/commands/dog"

describe("commands/dog()", function() {

  afterEach(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(dogCmd, {
      id:           "dog",
      category:     "fun",
      services:     ["discord", "twitchIRC"],
      args:         [[]],
      isRestricted: false,
      default:      dogCmd.default
    })
  })

  it("should output a random dog image", async function() {
    sinon.stub(fetch, "default").callsFake(async () => ({
      json: () => ({message: "foo.bar"})
    }))

    const message = await dogCmd.default({})

    assert.equal(fetch.default.args[0][0], "https://dog.ceo/api/breeds/image/random")
    assert.deepEqual(message, {
      output: "foo.bar",
      isFile: true
    })
  })

  it("should output a fallback dog image if the request failed", async function() {
    sinon.stub(fetch, "default").callsFake(fakeFetch)

    const messages = []
    let fakeFetch = async () => ({
      json: async () => ({})
    })

    messages[0] = await dogCmd.default({})
    
    fakeFetch = async () => {
      throw new Error("foobar")
    }
    
    messages[1] = await dogCmd.default({})

    assert.deepEqual(messages, [
      {
        output: "https://i.imgur.com/9oPUiCu.gif",
        isFile: true
      },
      {
        output: "https://i.imgur.com/9oPUiCu.gif",
        isFile: true
      }
    ])
  })

})