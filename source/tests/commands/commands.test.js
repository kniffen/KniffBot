import assert from "assert"

import * as commandsCmd from "../../bot/commands/commands"

describe("commands/commands()", function() {

  const bot = {
    settings: {
      prefix: "??",
      color: 0xFF0000
    }
  }

  it("Should have appropriate meta properties", function() {
    assert.equal(commandsCmd.id,           "commands")
    assert.equal(commandsCmd.category,     "info")
    assert.deepEqual(commandsCmd.services, ["discord", "twitchIRC"])
    assert.deepEqual(commandsCmd.args,     [[]])
  })

  it("should list all available commands", async function() {
    const messages = []

    messages[0] = await commandsCmd.default({service: "foobar"},    bot)
    messages[1] = await commandsCmd.default({service: "discord"},   bot)
    messages[2] = await commandsCmd.default({service: "twitchIRC"}, bot)
  
    assert.deepEqual(messages[0], {service: "foobar"})

    assert.deepEqual(messages[1], {
      service: "discord",
      output: {
        author: {
          icon_url: undefined,
          name: "🤖 Available bot commands",
          url: undefined
        },
        color: 0xFF0000,
        description: undefined,
        fields: [
          {
            inline: true,
            name: "fun",
            value: "??cat\n??comic\n??dog\n??8ball\n??throw\n??xkcd"
          },
          {
            inline: true,
            name: "info",
            value: "??commands\n??covid19\n??time\n??weather\n??wolfram"
          },
          {
            inline: true,
            name: "utility",
            value: "??help\n??ping\n??profile\n??stats"
          }
        ],
        file: undefined,
        files: [],
        footer: undefined,
        image: undefined,
        thumbnail: undefined,
        timestamp: undefined,
        title: undefined,
        url: undefined,
      }
    })

    assert.deepEqual(messages[2], {
      service: "twitchIRC",
      output:  "??cat ??commands ??dog ??8ball ??help ??ping ??throw ??time ??weather ??xkcd"
    })
  })

})