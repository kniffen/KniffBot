import assert from "assert"
import sinon  from "sinon"

import pkg from "../../../package.json"
import * as statsCmd from "../../bot/commands/stats"

describe("commands/stats()", function() {

  const bot = {
    settings: {
      color: 0xFF0000
    }
  }

  before(function() {
    sinon.stub(process, "uptime").returns(123456789)
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

    assert.deepEqual(message, {
      output: {
        title:       "🤖 Bot statistics",
        url:         "foo.bar",
        color:       0xFF0000,
        author:      undefined,
        description: undefined,
        file:        undefined,
        image:       undefined,
        thumbnail:   undefined,
        timestamp:   undefined,
        files:       [],
        fields: [
          {
            inline: true,
            name: "kniffbot",
            value: "v5.6.7"
          },
          {
            inline: true,
            name: "Uptime",
            value: "1428 days 21:33:09"
          },
          {
            inline: true,
            name: "​",
            value: "​"
          },
          {
            inline: true,
            name: "Node",
            value: "v1.2.3"
          },
          {
            inline: true,
            name: "discord.js",
            value: "vfoo"
          },
          {
            inline: true,
            name: "irc-framework",
            value: "vbar"
          },
          {
            inline: true,
            name: "weather-js",
            value: "vbaz"
          },
          {
            inline: true,
            name: "cleverbot-node",
            value: "vqux"
          },
          {
            inline: true,
            name: "node-wolfram-alpha",
            value: "vquux"
          },
          {
            inline: true,
            name: "moment-timezone",
            value: "vquuz"
          }
        ],
        footer: {
          icon_url: undefined,
          text: "corge License | Copyright (c) 2020 Kniffen",
        }
      }
    })

  })

})