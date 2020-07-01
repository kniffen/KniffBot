import assert    from "assert"
import sinon     from "sinon"
import DiscordJS from "discord.js"

import pkg from "../../../package.json"
import * as statsCmd from "../../bot/commands/stats"

describe("commands/stats()", function() {

  let bot

  before(function() {
    bot = {
      data: {
        settings: {
          color: "#FF0000"
        }
      }
    }

    sinon.stub(process, "version").value("v1.2.3")
    sinon.stub(pkg, 'version').value("5.6.7")
    sinon.stub(pkg, 'homepage').value("foo.bar")
    sinon.stub(pkg, 'license').value("corge")
    sinon.stub(pkg, 'dependencies').value({
      "discord.js":         "^foo",
      "irc-framework":      "^bar",
      "weather-js":         "^baz",
      "cleverbot-node":     "^qux",
      "node-wolfram-alpha": "^quux",
      "moment-timezone":    "^quuz"
    })
  })

  after(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(statsCmd, {
      id:           "stats",
      category:     "utility",
      services:     ["discord"],
      args:         [[]],
      isRestricted: true,
      default:      statsCmd.default
    })
  })

  it("should output various information about the bot", async function() {
    const message = await statsCmd.default({}, bot)
    const expected = {}

    expected.output = new DiscordJS.MessageEmbed({
      title: "🤖 Bot statistics",
      url:   "foo.bar",
      color: 0xFF0000
    })

    expected.output.addField("kniffbot",           "v5.6.7",             false)
    expected.output.addField("Node",               "v1.2.3",             true)
    expected.output.addField("discord.js",         "vfoo",               true)
    expected.output.addField("irc-framework",      "vbar",               true)
    expected.output.addField("weather-js",         "vbaz",               true)
    expected.output.addField("cleverbot-node",     "vqux",               true)
    expected.output.addField("node-wolfram-alpha", "vquux",              true)
    expected.output.addField("moment-timezone",    "vquuz",              true)

    expected.output.setFooter("corge License | Copyright (c) 2020 Kniffen")

    assert.deepEqual(message, expected)
  })

})