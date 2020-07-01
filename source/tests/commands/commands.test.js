import assert    from "assert"
import DiscordJS from "discord.js"

import * as commandsCmd from "../../bot/commands/commands"
import deepCopy         from "../../bot/utils/deepCopy"

describe("commands/commands()", function() {

  let bot

  before(function() {
    bot = {
      data: {
        settings: {
          color: "#FF0000",
          prefix: "??"
        }
      }
    }
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(commandsCmd, {
      id:           "commands",
      category:     "info",
      services:     ["discord", "twitchIRC"],
      args:         [[]],
      isRestricted: false,
      default:      commandsCmd.default
    })
  })

  it("should list all unrestricted commands", async function() {
    const messages = []
    const expected = []

    messages[0] = {service: "foobar"}
    messages[1] = {service: "discord"}
    messages[2] = {service: "discord", isOwner: true}
    messages[3] = {service: "twitchIRC"}

    expected[0] = deepCopy(messages[0])
    expected[1] = deepCopy(messages[1])
    expected[2] = deepCopy(messages[2])
    expected[3] = deepCopy(messages[3], {
      output:  "??cat ??commands ??dog ??8ball ??help ??ping ??throw ??time ??weather ??xkcd"
    })

    expected[1].output = new DiscordJS.MessageEmbed()
    expected[2].output = new DiscordJS.MessageEmbed()
 
    expected[1].output.setAuthor("🤖 Available bot commands")
    expected[1].output.setColor(bot.data.settings.color)
    expected[1].output.addField("utility", "??help\n??ping\n??profile",                                     true)
    expected[1].output.addField("fun",     "??cat\n??comic\n??dog\n??8ball\n??throw\n??xkcd",               true)
    expected[1].output.addField("info",    "??commands\n??covid19\n??time\n??uptime\n??weather\n??wolfram", true)

    expected[2].output.setAuthor("🤖 Available bot commands")
    expected[2].output.setColor(bot.data.settings.color)
    expected[2].output.addField("utility", "??addrolereact\n??help\n??ping\n??profile\n??removerolereact\n??stats", true)
    expected[2].output.addField("fun",     "??cat\n??comic\n??dog\n??8ball\n??throw\n??xkcd",                       true)
    expected[2].output.addField("info",    "??commands\n??covid19\n??time\n??uptime\n??weather\n??wolfram",         true)

    messages[0] = await commandsCmd.default(messages[0], bot)
    messages[1] = await commandsCmd.default(messages[1], bot)
    messages[2] = await commandsCmd.default(messages[2], bot)
    messages[3] = await commandsCmd.default(messages[3], bot)
  
    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])
    assert.deepEqual(messages[2], expected[2])
    assert.deepEqual(messages[3], expected[3])
  })

})