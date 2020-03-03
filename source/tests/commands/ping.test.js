import assert from "assert"
import sinon  from "sinon"

import * as pingCmd from "../../bot/commands/ping"

describe("commands/ping()", function() {

  it("Should have appropriate meta properties", function() {
    assert.equal(pingCmd.id,            "ping")
    assert.equal(pingCmd.category,      "utility")
    assert.deepEqual(pingCmd.services, ["discord", "twitchIRC"])
    assert.deepEqual(pingCmd.args,     [[]])
  })

  it("should output \"Pong!\"", async function() {
    const message = await pingCmd.default({})

    assert.deepEqual(message, {output: "pong!"})
  })

})