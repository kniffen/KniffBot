import assert from "assert"
import sinon  from "sinon"

import * as pingCmd from "../../bot/commands/ping"

describe("commands/ping()", function() {

  it("Should have appropriate properties", function() {
    assert.deepEqual(pingCmd, {
      id:           "ping",
      category:     "utility",
      services:     ["discord", "twitchIRC"],
      args:         [[]],
      isRestricted: false,
      default:      pingCmd.default
    })
  })

  it("should output \"Pong!\"", async function() {
    const message = await pingCmd.default({})

    assert.deepEqual(message, {output: "pong!"})
  })

})