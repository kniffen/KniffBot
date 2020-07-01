import assert    from "assert"
import sinon     from "sinon"
import weatherJS from "weather-js"
import DiscordJS from "discord.js"

import * as weatherCmd from "../../bot/commands/weather"
import deepCopy        from "../../bot/utils/deepCopy"

describe("commands/weather()", function() {

  let bot, weatherData, discordOutput

  before(async function() {
    bot = {
      data: {
        settings: {
          color: "#FF0000",
          prefix: "??"
        },
        profiles: [
          {
            id:       1234,
            location: "foo bar",
            service:  "discord"
          },
          {
            id:       4321,
            service:  "discord",
          }
        ]
      }
    }

    sinon.stub(weatherJS, "find").callsFake((input, cb) => {cb(undefined, weatherData)})
  })

  after(function() {
    sinon.restore()
  })

  beforeEach(function() {
    weatherJS.find.resetHistory()

    weatherData = [
      {
        location: {
          name: "FooBar"
        },
        current: {
          day:             "foo",
          observationtime: "bar",
          skytext:         "baz",
          imageUrl:        "foo.bar",
          windspeed:       "0 km/h",
          winddisplay:     "64 km/h southeast",
          temperature:     16,
          feelslike:       0,
        },
        forecast: [
          {},
          {
            day:        "qux",
            skytextday: "quux",
            low:        -20,
            high:       30,
            precip:     "50"
          }
        ]
      }
    ]

    discordOutput = new DiscordJS.MessageEmbed()

    discordOutput.setAuthor("Weather report for FooBar", "foo.bar")
    discordOutput.setColor(16711680)

    discordOutput.addField("foo bar",            "baz",                      false)
    discordOutput.addField("Temp",               "16°C/60°F",                true)
    discordOutput.addField("Feels like",         "0°C/32°F",                 true)
    discordOutput.addField("Wind",               "18m/s or 40mph southeast", true)
    discordOutput.addField("qux forecast",       "quux",                     false)
    discordOutput.addField("Temp low",           "-20°C/-4°F",               true)
    discordOutput.addField("Temp high",          "30°C/86°F",                true)
    discordOutput.addField("Precip probability", "50%",                      true)

    discordOutput.setFooter("Weather report provided by Microsoft")
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(weatherCmd, {
      id:           "weather",
      category:     "info",
      services:     ["discord", "twitchIRC"],
      args:         [
       [],
       ["<location>"],
       ["@username"]
      ],
      isRestricted: false,
      default:      weatherCmd.default
    })
  })

  it("should output a weather report for a location", async function() {
    const messages = []
    const expected = []

    messages[0] = {service: "foobar",  command: {args: []}}
    messages[1] = {service: "foobar",  command: {args: ["bar", "foo"]}}
    messages[2] = {service: "discord", command: {args: ["bar", "foo"]}}
    messages[3] = {service: "discord", command: {args: ["bar", "foo"]}}

    expected[0] = deepCopy(messages[0], {
      isReply: true,
      output:  "Something went wrong 😱\nDo `??help weather` for usage."
    })
    
    expected[1] = deepCopy(messages[1], {
      isReply: false,
      output:  "Weather report for FooBar\nbaz 16°C/60°F"
    })
    
    expected[2] = deepCopy(messages[2], {
      isReply: false,
      output:  discordOutput
    })

    expected[3] = deepCopy(messages[3], {
      isReply: false,
      output:  discordOutput
    })

    messages[0] = await weatherCmd.default({service: "foobar",  command: {args: []}}, bot)
    messages[1] = await weatherCmd.default({service: "foobar",  command: {args: ["bar", "foo"]}}, bot)
    messages[2] = await weatherCmd.default({service: "discord", command: {args: ["bar", "foo"]}}, bot)

    assert.deepEqual(weatherJS.find.args[0][0], {search: "bar foo", degreeType: 'C'})

    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])
    assert.deepEqual(messages[2], expected[2])

    weatherData[0].current.winddisplay = "64 km/h"
    expected[3].output.fields[3].value = "18m/s or 40mph "

    messages[3] = await weatherCmd.default({service: "discord", command: {args: ["bar", "foo"]}}, bot)
  })

  it("should output a weather report for the author", async function() {
    const messages = []
    const expected = []

    messages[0] = {service: "foobar",  author: {id: 1234}, command:{args: []}}
    messages[1] = {service: "discord", author: {id: 1234}, command:{args: []}}
    messages[2] = {service: "discord", author: {id: 4321}, command:{args: []}}
    messages[3] = {service: "discord", author: {id: 5678}, command:{args: []}}

    expected[0] = deepCopy(messages[0], {
      isReply: true,
      output:  "Something went wrong 😱\nDo `??help weather` for usage."
    })

    expected[1] = deepCopy(messages[1], {
      isReply: false,
      output:  discordOutput
    })

    expected[2] = deepCopy(messages[2], {
      isReply: true,
      output:  "Sorry, I don't have a location set for you\nUse `??profile location <name or zip code>` here or in a PM to set one"
    })

    expected[3] = deepCopy(messages[3], {
      isReply: true,
      output:  "Sorry, I don't have a location set for you\nUse `??profile location <name or zip code>` here or in a PM to set one"
    })

    messages[0] = await weatherCmd.default(messages[0], bot)
    messages[1] = await weatherCmd.default(messages[1], bot)
    messages[2] = await weatherCmd.default(messages[2], bot)
    messages[3] = await weatherCmd.default(messages[3], bot)

    assert(weatherJS.find.calledOnce)
    assert.deepEqual(weatherJS.find.args[0][0], {search: "foo bar", degreeType: 'C'})

    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])
    assert.deepEqual(messages[2], expected[2])
    assert.deepEqual(messages[3], expected[3])
  })

  it("should be able to get weather reports for specified users", async function() {
    const messages = []
    const expected = []

    messages[0] = {service: "foobar",  command: {args: ["@Qux"]}, mentions: [{id: 1234, username: "Qux"}]}
    messages[1] = {service: "discord", command: {args: ["@Qux"]}, mentions: [{id: 1234, username: "Qux"}]}
    
    expected[0] = deepCopy(messages[0], {
      isReply: true,
      output:  "Something went wrong 😱\nDo `??help weather` for usage."
    })

    expected[1] = deepCopy(messages[1], {
      isReply: false,
      output:  discordOutput
    })

    expected[1].output.setAuthor("Weather report for Qux", "foo.bar")

    messages[0] = await weatherCmd.default(messages[0], bot)
    messages[1] = await weatherCmd.default(messages[1], bot)
    
    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])
  })

  it("should output a specific error message if it was unable to fetch the weather data", async function() {
    let message = {
      command: {
        args: ["foo"]
      },
    }

    weatherJS.find.restore()
    sinon.stub(weatherJS, "find").callsFake((input, cb) => {cb("error")})

    message = await weatherCmd.default(message, bot)

    assert.deepEqual(message, {
      command: {
        args: ["foo"]
      },
      isReply: true,
      output: "Something went wrong 😱\nI was unable to fetch a weather report for you"
    })
  })

})