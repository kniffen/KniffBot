import assert     from "assert"
import sinon      from "sinon"
import * as fetch from "node-fetch"
import { RichEmbed } from "discord.js"

import deepCopy        from "../../bot/utils/deepCopy"
import * as covid19Cmd from "../../bot/commands/covid19"

describe("commands/covid19()", function() {

  const bot = {
    data: {
      settings: {
        color: 0xFF0000
      }
    }
  }

  const richEmbed = new RichEmbed()

  afterEach(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(covid19Cmd, {
      id:           "covid19",
      category:     "info",
      services:     ["discord"],
      args:         [[], ["country/state"]],
      isRestricted: false,
      default:      covid19Cmd.default
    })
  })

  it("Should output world wide stats and news", async function() {
    sinon.stub(fetch, "default").callsFake(async (url) => ({
      json: () => {
        if (url == "https://corona.lmao.ninja/v2/all") {
          return {
            updated:   1000000,
            cases:     2000000,
            deaths:    3000000,
            recovered: 4000000
          }
        } else {
          return {}
        }
      }
    }))

    const message = await covid19Cmd.default({
      command: { args: [] }
    }, bot)

    assert.equal(fetch.default.args[0][0], "https://corona.lmao.ninja/v2/all")

    assert.deepEqual(message.output, deepCopy(richEmbed, {
      author: {
        url:      undefined,
        icon_url: undefined,
        name: "Latest COVID-19 global stats"
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
        }
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info/coronavirus"
      }
    }))
  })

  it("Should output stats for a specified country or state", async function() {
    sinon.stub(fetch, "default").callsFake(async (url) => ({
      json: () => {
        if (url == "https://corona.lmao.ninja/v2/all") {
          return {
            updated:   1000000,
          }
        } else if (url == "https://corona.lmao.ninja/v2/countries") {
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
              tests:               11000000,
              testsPerOneMillion:  12000000,
              countryInfo: {
                flag: "foo.flag"
              }
            },
            {
              country:                "US",
              cases:                200000,
              active:               300000,
              critical:             400000,
              deaths:               500000,
              todayDeaths:          600000,
              recovered:            700000,
              todayCases:           800000,
              casesPerOneMillion:   900000,
              deathsPerOneMillion: 1000000,
              tests:               1100000,
              testsPerOneMillion:  1200000,
              countryInfo: {
                iso3: "USA",
                flag: "bar.flag"
              }
            }
          ]
        } else if (url == "https://corona.lmao.ninja/v2/states") {
          return [{
            state:         "BAR BAZ",
            cases:           2000000,
            active:          3000000,
            deaths:          4000000,
            todayDeaths:     5000000,
            todayCases:      6000000,
            tests:           7000000,
            testsPerOneMillion: 8000000,
          }]
        }
      }
    }))

    const messages = []
    messages[0] = await covid19Cmd.default({command: { args: ["Foo"] }},        bot)
    messages[1] = await covid19Cmd.default({command: { args: ["Bar", "baz"] }}, bot)
    messages[2] = await covid19Cmd.default({command: { args: ["Qux"] }}, bot)
    
    assert.equal(fetch.default.args[0][0], "https://corona.lmao.ninja/v2/all")
    assert.equal(fetch.default.args[1][0], "https://corona.lmao.ninja/v2/countries")
    assert.equal(fetch.default.args[2][0], "https://corona.lmao.ninja/v2/states")

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
          name:  "Cases per million",
          value: "9,000,000",
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
          name:  "Deaths per million",
          value: "10,000,000",
          inline: true
        },
        {
          name:  "Tests",
          value: "11,000,000",
          inline: true
        },
        {
          name:  "\u200b",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Tests per million",
          value: "12,000,000",
          inline: true
        },
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info/coronavirus"
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
          name:  "Cases per million",
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
          name:  "Deaths per million",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Tests",
          value: "7,000,000",
          inline: true
        },
        {
          name:  "\u200b",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Tests per million",
          value: "8,000,000",
          inline: true
        },
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info/coronavirus"
      }
    }))
    assert.deepEqual(messages[2].output, deepCopy(richEmbed, {
      author: {
        url:      "https://worldometers.info/coronavirus",
        icon_url: "bar.flag",
        name:     "Latest COVID-19 stats for US"
      },
      color:       0xFF0000,
      timestamp:   1000000,
      fields: [
        {
          name:  "Active",
          value: "300,000",
          inline: true
        },
        {
          name:  "Critical",
          value: "400,000",
          inline: true
        },
        {
          name:  "Recovered",
          value: "700,000",
          inline: true
        },
        {
          name:  "Cases",
          value: "200,000",
          inline: true
        },
        {
          name:  "Cases today",
          value: "800,000",
          inline: true
        },
        {
          name:  "Cases per million",
          value: "900,000",
          inline: true
        },
        {
          name:  "Deaths",
          value: "500,000",
          inline: true
        },
        {
          name:  "Deaths today",
          value: "600,000",
          inline: true
        },
        {
          name:  "Deaths per million",
          value: "1,000,000",
          inline: true
        },
        {
          name:  "Tests",
          value: "1,100,000",
          inline: true
        },
        {
          name:  "\u200b",
          value: "\u200b",
          inline: true
        },
        {
          name:  "Tests per million",
          value: "1,200,000",
          inline: true
        },
      ],
      footer: {
        icon_url: undefined,
        text:     "Data provided by worldometers.info/coronavirus"
      }
    }))
  })
})
