import assert     from "assert"
import sinon      from "sinon"
import * as fetch from "node-fetch"
import { RichEmbed } from "discord.js"

import deepCopy        from "../../bot/utils/deepCopy"
import * as covid19Cmd from "../../bot/commands/covid19"

describe("commands/covid19()", function() {

  const bot = {
    settings: {
      color: 0xFF0000
    }
  }

  const richEmbed = new RichEmbed()

  afterEach(function() {
    sinon.restore()
  })

  it("Should have appropriate meta properties", function() {
    assert.equal(covid19Cmd.id,           "covid19")
    assert.equal(covid19Cmd.category,     "info")
    assert.deepEqual(covid19Cmd.services, ["discord"])
    assert.deepEqual(covid19Cmd.args,     [[], ["country/state"]])
  })

  it("Should output world wide stats and news", async function() {
    sinon.stub(fetch, "default").callsFake(async (url) => ({
      json: () => {
        if (url == "https://corona.lmao.ninja/all") {
          return {
            updated:   1000000,
            cases:     2000000,
            deaths:    3000000,
            recovered: 4000000
          }
        } else if (url == "https://www.reddit.com/live/14d816ty1ylvo/.json") {
          return {
            data: {
              children: [
                {},
                {data: {mobile_embeds: []}},
                {data: {mobile_embeds: [{title: "foo",  description: "foobar",  original_url: "foobarbaz"}]}},
                {data: {mobile_embeds: [{title: "bar",  description: "barbar",  original_url: "barbarbaz"}]}},
                {data: {mobile_embeds: [{title: "baz",  description: "bazbar",  original_url: "bazbarbaz"}]}},
                {data: {mobile_embeds: [{title: "qux",  description: "quxbar",  original_url: "quxbarbaz"}]}},
                {data: {mobile_embeds: [{title: "quux", description: "quuxbar", original_url: "quuxbarbaz"}]}},
                {data: {mobile_embeds: [{title: "quuz", description: "quuzbar", original_url: "quuzbarbaz"}]}}
              ]
            }
          }
        } else {
          return {}
        }
      }
    }))

    const message = await covid19Cmd.default({
      command: { args: [] }
    }, bot)

    assert.equal(fetch.default.args[0][0], "https://corona.lmao.ninja/all")
    assert.equal(fetch.default.args[1][0], "https://www.reddit.com/live/14d816ty1ylvo/.json")

    assert.deepEqual(message.output, deepCopy(richEmbed, {
      author: {
        url:      undefined,
        icon_url: undefined,
        name: "Latest COVID-19 stats and news"
      },
      color:       0xFF0000,
      timestamp:   1000000,
      fields: [
        {
          name:  "Cases",
          value: "2,000,000",
          inline: true
        },
        {
          name:  "Deaths",
          value: "3,000,000",
          inline: true
        },
        {
          name:  "Recovered",
          value: "4,000,000",
          inline: true
        },
        {
          name:  "foo",
          value: "foobar\nfoobarbaz",
          inline: false
        },
        {
          name:  "bar",
          value: "barbar\nbarbarbaz",
          inline: false
        },
        {
          name:  "baz",
          value: "bazbar\nbazbarbaz",
          inline: false
        },
        {
          name:  "qux",
          value: "quxbar\nquxbarbaz",
          inline: false
        },
        {
          name:  "quux",
          value: "quuxbar\nquuxbarbaz",
          inline: false
        }
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info/coronavirus\nNews provided by reddit.com/live/14d816ty1ylvo"
      }
    }))
  })

  it("Should output stats for a specified country or state", async function() {
    sinon.stub(fetch, "default").callsFake(async (url) => ({
      json: () => {
        if (url == "https://corona.lmao.ninja/all") {
          return {
            updated:   1000000,
          }
        } else if (url == "https://corona.lmao.ninja/countries") {
          return [
            {
              country:                "FOO",
              cases:                2000000,
              active:               3000000,
              critical:             4000000,
              deaths:               5000000,
              todayDeaths:          6000000,
              recovered:            7000000,
              todayCases:           8000000,
              casesPerOneMillion:   9000000,
              deathsPerOneMillion: 10000000,
              countryInfo: {
                flag: "foo.flag"
              }
            },
            {
              country: "US",
              countryInfo: {
                iso3: "USA",
                flag: "bar.flag"
              }
            }
          ]
        } else if (url == "https://corona.lmao.ninja/yesterday") {
          return [
            {
              country:              "FOO",
              todayDeaths:        11000000,
              todayCases:         12000000,
              countryInfo: {
                flag: "foo.flag"
              }
            },
            {
              country: "US",
              countryInfo: {
                iso3: "USA",
                flag: "bar.flag"
              }
            }
          ]
        } else if (url == "https://corona.lmao.ninja/states") {
          return [{
            state:     "BAR BAZ",
            cases:       2000000,
            active:      3000000,
            deaths:      4000000,
            todayDeaths: 5000000,
            todayCases:  6000000,
          }]
        }
      }
    }))

    const messages = []
    messages[0] = await covid19Cmd.default({command: { args: ["Foo"] }},        bot)
    messages[1] = await covid19Cmd.default({command: { args: ["Bar", "baz"] }}, bot)
    messages[2] = await covid19Cmd.default({command: { args: ["Qux"] }}, bot)
    
    assert.equal(fetch.default.args[0][0], "https://corona.lmao.ninja/all")
    assert.equal(fetch.default.args[1][0], "https://corona.lmao.ninja/countries")
    assert.equal(fetch.default.args[2][0], "https://corona.lmao.ninja/yesterday")
    assert.equal(fetch.default.args[3][0], "https://corona.lmao.ninja/states")

    assert.deepEqual(messages[0].output, deepCopy(richEmbed, {
      author: {
        url:      "https://worldometers.info/coronavirus",
        icon_url: "foo.flag",
        name:     "Latest COVID-19 stats for FOO"
      },
      color:       0xFF0000,
      timestamp:   1000000,
      fields: [
        {
          name:  "Cases",
          value: "2,000,000",
          inline: true
        },
        {
          name:  "Cases today",
          value: "8,000,000",
          inline: true
        },
        {
          name:  "Cases yesterday",
          value: "12,000,000",
          inline: true
        },
        {
          name:  "Active",
          value: "3,000,000",
          inline: true
        },
        {
          name:  "Critical",
          value: "4,000,000",
          inline: true
        },
        {
          name:  "Recovered",
          value: "7,000,000",
          inline: true
        },
        {
          name:  "Deaths",
          value: "5,000,000",
          inline: true
        },
        {
          name:  "Deaths today",
          value: "6,000,000",
          inline: true
        },
        {
          name:  "Deaths yesterday",
          value: "11,000,000",
          inline: true
        },
        {
          name:  "Cases per million",
          value: "9,000,000",
          inline: true
        },
        {
          name:  "Deaths per million",
          value: "10,000,000",
          inline: true
        },
        {
          name:  "\u200b",
          value: "\u200b",
          inline: true
        },
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info"
      }
    }))

    assert.deepEqual(messages[1].output, deepCopy(richEmbed, {
      author: {
        url:      "https://worldometers.info/coronavirus",
        icon_url: "bar.flag",
        name:     "Latest COVID-19 stats for BAR BAZ"
      },
      color:       0xFF0000,
      timestamp:   1000000,
      fields: [
        {
          name:  "Cases",
          value: "2,000,000",
          inline: true
        },
        {
          name:  "Cases today",
          value: "6,000,000",
          inline: true
        },
        {
          name:  "Cases yesterday",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Active",
          value: "3,000,000",
          inline: true
        },
        {
          name:  "Critical",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Recovered",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Deaths",
          value: "4,000,000",
          inline: true
        },
        {
          name:  "Deaths today",
          value: "5,000,000",
          inline: true
        },
        {
          name:  "Deaths yesterday",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Cases per million",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Deaths per million",
          value: "\u200b",
          inline: true
        },
        {
          name:  "\u200b",
          value: "\u200b",
          inline: true
        },
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info"
      }
    }))

    assert.deepEqual(messages[2], {command: { args: ["Qux"] }})
  })
})
