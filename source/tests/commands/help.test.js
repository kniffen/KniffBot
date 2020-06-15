import assert     from "assert"
import sinon      from "sinon"

import * as helpCmd from "../../bot/commands/help"

describe("commands/cat()", function() {

  const bot = {
    settings: {
      prefix: "??"
    }
  }

  it("Should have appropriate properties", function() {
    assert.deepEqual(helpCmd, {
      id:           "help",
      category:     "utility",
      services:     ["discord", "twitchIRC"],
      args:         [["<command>"]],
      isRestricted: false,
      default:      helpCmd.default
    })
  })

  it("should output a specific error message if there are missing arguments", async function() {
    const message = await helpCmd.default({command: {args: []}}, bot)

    assert.deepEqual(message, {
      command: {args: []},
      output: "Missing arguments use. `??help <command>`"
    })
  })
  
  it("should output a specific error message if the command does not exist", async function() {
    const message = await helpCmd.default({command: {args: ["Foo"]}}, bot)

    assert.deepEqual(message, {
      command: {args: ["Foo"]},
      output: "The command `??foo` does not exist.\nuse `??commands` to get a list of commands"
    })
  })

  it("should output the available arguments for a command", async function() {
    const messages = []

    messages[0] = await helpCmd.default({command: {args: ["ping"]}},    bot)
    messages[1] = await helpCmd.default({command: {args: ["??ping"]}},  bot)
    messages[2] = await helpCmd.default({command: {args: ["profile"]}}, bot)

    assert.deepEqual(messages, [
      {
        command: {args: ["ping"]},
        output: "Usages for `??ping`\n`??ping `"
      },
      {
        command: {args: ["??ping"]},
        output: "Usages for `??ping`\n`??ping `"
      },
      {
        command: {args: ["profile"]},
        output: "Usages for `??profile`\n`??profile `\n`??profile location`\n`??profile location <location>`\n`??profile remove <item>`\n`??profile @username`"
      }
    ])
  })

})