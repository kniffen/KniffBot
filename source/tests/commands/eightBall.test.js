import assert from "assert"
import sinon  from "sinon"

import * as eightBallCmd from "../../bot/commands/eightBall"

describe("commands/eightBall()", function() {

  const bot = {
    settings: {
      prefix: "??"
    }
  }

  before(function() {
    sinon.stub(Math, "random").returns(0.5)
  })

  after(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(eightBallCmd, {
      id:           "8ball",
      category:     "fun",
      services:     ["discord", "twitchIRC"],
      args:         [["<question>"]],
      isRestricted: false,
      default:      eightBallCmd.default
    })
  })

  it("should output a random answer", async function() {
    let message = {
      service: "discord",
      command: {
        args: ["foo"]
      }
    }

    message = await eightBallCmd.default(message)

    assert.equal(message.output, "Reply hazy try again")
  })

  it("should output a specific error message if there are missing arguments", async function() {
    const message = await eightBallCmd.default({}, bot)

    assert.deepEqual(message, {
      output: "Something went wrong 😱\nDo `??help 8ball` for usage."
    })
  })

})