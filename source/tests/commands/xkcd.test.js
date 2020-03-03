import assert from "assert"
import sinon  from "sinon"
import * as fetch from "node-fetch"

import * as xkcdCmd from "../../bot/commands/xkcd"

describe("commands/xkcd()", function() {

  before(function() {
    sinon.stub(fetch, "default").callsFake(async (url) => {
      return {
        json: async () => ({
          img: "foobar"
        })
      }
    })
  })

  after(function() {
    sinon.restore()
  })

  afterEach(function() {
    fetch.default.resetHistory()
  })

  it("Should have appropriate meta properties", function() {
    assert.equal(xkcdCmd.id,           "xkcd")
    assert.equal(xkcdCmd.category,     "fun")
    assert.deepEqual(xkcdCmd.services, ["discord", "twitchIRC"])
    assert.deepEqual(xkcdCmd.args,     [[], ["<id>"]])
  })

  it("should output the latest XKCD comic", async function() {
    const message = await xkcdCmd.default({})

    assert.equal(fetch.default.args[0][0], "https://xkcd.com/info.0.json")
    assert.deepEqual(message, {
      output: "foobar",
      isFile: true
    })
  })

  it("should output a specified XKCD comic", async function() {
    const message = await xkcdCmd.default({
      command: {
        args: ["foo", "bar"]
      }
    })

    assert.equal(fetch.default.args[0][0], "https://xkcd.com/foo/info.0.json")
    assert.deepEqual(message, {
      command: {
        args: ["foo", "bar"]
      },
      output: "foobar",
      isFile: true
    })
  })

  it("should a fallback XKCD comic if the request was unsuccessful", async function() {
    fetch.default.restore()

    sinon.stub(fetch, "default").callsFake(async () => {
      throw new error("qux")
    })

    const message = await xkcdCmd.default({})

    assert.deepEqual(message, {
      output: "https://imgs.xkcd.com/comics/not_available.png",
      isFile: true
    })
  })

})