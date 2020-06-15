import assert from "assert"
import sinon  from "sinon"

import * as comicCmd from "../../bot/commands/comic"

describe("commands/comic()", function() {

  it("Should have appropriate properties", function() {
    assert.deepEqual(comicCmd, {
      id:           "comic",
      category:     "fun",
      services:     ["discord"],
      args:         [["<amount>"]],
      isRestricted: false,
      default:      comicCmd.default
    })
  })

  it("should generate and output a comic image based on the previous X messages")

})