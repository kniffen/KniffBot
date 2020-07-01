import assert from "assert"
import sinon  from "sinon"

import * as throwCmd from "../../bot/commands/throw"

describe("commands/throw()", function() {
  let bot

  before(function() {
    bot = {
      data: {
        settings: {
          prefix: "??"
        }
      }
    }
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(throwCmd, {
      id:           "throw",
      category:     "fun",
      services:     ["discord", "twitchIRC"],
      args:         [[], ["<thing>"]],
      isRestricted: false,
      default:      throwCmd.default
    })
  })

  it("should throw the arguments", async function() {
    const message = await throwCmd.default({
      input: "??throw foo bar",
      emojis:  []
    }, bot)

    assert.deepEqual(message, {
      input: "??throw foo bar",
      emojis: [],
      output: "(╯°□°）╯︵  foo bar"
    })
  })

})