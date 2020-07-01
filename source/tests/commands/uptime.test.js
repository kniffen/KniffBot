import assert    from "assert"
import sinon     from "sinon"
import DiscordJS from "discord.js"

import * as uptimeCmd from "../../bot/commands/uptime"

describe("commands/uptime()", function() {

  let clock, message, bot

  before(async function() {
    clock = sinon.useFakeTimers()

    bot = {
      data: {
        settings: {
          color: "#FF0000"
        }
      },
      discord: {
        uptime: 12345678
      }
    }

    message = await uptimeCmd.default({}, bot)
  })

  after(function() {
    sinon.restore()
    clock.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(uptimeCmd, {
      id:           "uptime",
      category:     "info",
      services:     ["discord"],
      args:         [[]],
      isRestricted: false,
      default:      uptimeCmd.default
    })
  })

  it("Should output a rich embed of the bot's current uptime", function() {
    const expected = {
      output: new DiscordJS.MessageEmbed()
    }

    expected.output.setTitle("⏱️ Bot uptime")
    expected.output.setColor("#FF0000")

    expected.output.addField("Last launched", "Wednesday, December 31, 1969 11:59 PM UTC\n(a few seconds ago)")
    expected.output.addField("Last login",    "Wednesday, December 31, 1969 8:34 PM UTC\n(3 hours ago)")

    assert.deepEqual(message, expected)
  })

})