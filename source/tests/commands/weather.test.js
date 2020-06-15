import assert    from "assert"
import sinon     from "sinon"
import DiscordJS from "discord.js"
import weatherJS from "weather-js"

import * as weatherCmd from "../../bot/commands/weather"

describe("commands/weather()", function() {

  const bot = {
    data: {
      settings: {
        prefix: "??",
        color: "#FF0000"
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

  let weatherData, discordResult

  before(function() {
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

    discordResult = {
      author: {
        icon_url: "foo.bar",
        name: "Weather report for FooBar",
        url: undefined
      },
      color: 16711680,
      files: [],
      description: undefined,
      file:        undefined,
      image:       undefined,
      thumbnail:   undefined,
      timestamp:   undefined,
      title:       undefined,
      url:         undefined,
      fields: [
        {
          inline: false,
          name:   "foo bar",
          value:  "baz",
        },
        {
          inline: true,
          name:   "Temp",
          value:  "16°C/60°F",
        },
        {
          inline: true,
          name:   "Feels like",
          value:  "0°C/32°F",
        },
        {
          inline: true,
          name: "Wind",
          value: "18m/s or 40mph southeast"
        },
        {
          inline: false,
          name:   "qux forecast",
          value:  "quux",
        },
        {
          inline: true,
          name:   "Temp low",
          value:  "-20°C/-4°F",
        },
        {
          inline: true,
          name:   "Temp high",
          value:  "30°C/86°F",
        },
        {
          inline: true,
          name:   "Precip probability",
          value:  "50%",
        }
      ],
      footer: {
        icon_url: undefined,
        text:  "Weather report provided by Microsoft"
      }
    }
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

    messages[0] = await weatherCmd.default({service: "foobar",  command: {args: []}}, bot)
    messages[1] = await weatherCmd.default({service: "foobar",  command: {args: ["bar", "foo"]}}, bot)
    messages[2] = await weatherCmd.default({service: "discord", command: {args: ["bar", "foo"]}}, bot)

    weatherData[0].current.winddisplay = "64 km/h"
    messages[3] = await weatherCmd.default({service: "discord", command: {args: ["bar", "foo"]}}, bot)

    assert.deepEqual(weatherJS.find.args[0][0], {search: "bar foo", degreeType: 'C'})
    
    assert.deepEqual(messages[0], {
      service: "foobar",
      command: {args: []},
      isReply: true,
      output:  "Something went wrong 😱\nDo `??help weather` for usage.",
    })

    assert.deepEqual(messages[1], {
      service: "foobar",
      command: {args: ["bar", "foo"]},
      isReply: false,
      output:  "Weather report for FooBar\nbaz 16°C/60°F",
    })
    
    assert.deepEqual(messages[2], {
      service: "discord",
      command: {args: ["bar", "foo"]},
      isReply: false,
      output:  discordResult
    })

    discordResult.fields[3].value = "18m/s or 40mph "
    assert.deepEqual(messages[3], {
      service: "discord",
      command: {args: ["bar", "foo"]},
      isReply: false,
      output:  discordResult
    })
  })

  it("should output a weather report for the author", async function() {
    const message1 = await weatherCmd.default({
      service: "foobar",
      author: {id: 1234},
      command: {args: []}
    }, bot)
    
    const message2 = await weatherCmd.default({
      service: "discord", 
      author: {id: 1234},
      command: {args: []}
    }, bot)

    const message3 = await weatherCmd.default({
      service: "discord", 
      author: {id: 4321},
      command: {args: []}
    }, bot)

    const message4 = await weatherCmd.default({
      service: "discord", 
      author: {id: 5678},
      command: {args: []}
    }, bot)


    assert(weatherJS.find.calledOnce)
    assert.deepEqual(weatherJS.find.args[0][0], {search: "foo bar", degreeType: 'C'})

    assert.deepEqual(message1, {
      service: "foobar",
      author:  {id: 1234},
      command: {args: []},
      isReply: true,
      output:  "Something went wrong 😱\nDo `??help weather` for usage."
    })

    assert.deepEqual(message2, {
      service: "discord",
      author:  {id: 1234},
      command: {args: []},
      isReply: false,
      output:  Object.assign(discordResult, {
        author: {
          icon_url: "foo.bar",
          name:     "Weather report for FooBar",
          url:      undefined
        }
      })
    })

    assert.deepEqual(message3, {
      service: "discord",
      author:  {id: 4321},
      command: {args: []},
      isReply: true,
      output:  "Sorry, I don't have a location set for you\nUse `??profile location <name or zip code>` here or in a PM to set one"
    })

    assert.deepEqual(message4, {
      service: "discord",
      author:  {id: 5678},
      command: {args: []},
      isReply: true,
      output:  "Sorry, I don't have a location set for you\nUse `??profile location <name or zip code>` here or in a PM to set one"
    })
  })

  it("should be able to get weather reports for specified users", async function() {
    let message1 = {
      service: "foobar",
      command: {args: ["@Qux"]},
      mentions: [{
        id: 1234,
        username: "Qux"
      }]
    }

    let message2 = {
      service: "discord",
      command: {args: ["@Qux"]},
      mentions: [{
        id: 1234,
        username: "Qux"
      }]
    }

    message1 = await weatherCmd.default(message1, bot)
    message2 = await weatherCmd.default(message2, bot)

    assert.deepEqual(message1, {
      service: "foobar",
      command: {args: ["@Qux"]},
      mentions: [{
        id: 1234,
        username: "Qux"
      }],
      isReply: true,
      output: "Something went wrong 😱\nDo `??help weather` for usage."
    })

    assert.deepEqual(message2, {
      service: "discord",
      command: {args: ["@Qux"]},
      isReply: false,
      mentions: [{
        id: 1234,
        username: "Qux"
      }],
      output: Object.assign(discordResult, {
        author: {
          icon_url: "foo.bar",
          name:     "Weather report for Qux",
          url:      undefined
        }
      })
    })
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