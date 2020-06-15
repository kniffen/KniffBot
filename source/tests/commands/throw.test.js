import assert from "assert"
import sinon  from "sinon"

import * as throwCmd from "../../bot/commands/throw"

describe("commands/throw()", function() {

  const bot = {
    data: {
      settings: {
        prefix: "??"
      }
    },
    discord: {
      emojis: {
        get: (id) => id == 1234 ? "foobar" : undefined
      }
    }
  }

  it("Should have appropriate properties", function() {
    assert.deepEqual(throwCmd, {
      id:           "throw",
      category:     "fun",
      services:     ["discord", "twitchIRC"],
      args:         [[], ["<thing>"]],
      isRestricted: false,
      default:      throwCmd.default
    })
  })

  it("should throw the arguments", async function() {
    const message = await throwCmd.default({
      input: "??throw foo bar",
      emojis:  []
    }, bot)

    assert.deepEqual(message, {
      input: "??throw foo bar",
      emojis: [],
      output: "(╯°□°）╯︵  foo bar"
    })
  })


  it("should replace emojis in the input string if there are any", async function() {
    const message = await throwCmd.default({
      input: "??throw foo <:foo:1234> bar <:bar:5678>",
      emojis:  [
        {string: "<:foo:1234>", id: 1234, name: "foo"},
        {string: "<:bar:5678>", id: 5678, name: "bar"}
      ]
    }, bot)

    assert.deepEqual(message, {
      input: "??throw foo <:foo:1234> bar <:bar:5678>",
      emojis:  [
        {string: "<:foo:1234>", id: 1234, name: "foo"},
        {string: "<:bar:5678>", id: 5678, name: "bar"}
      ],
      output: "(╯°□°）╯︵  foo foobar bar bar"
    })
  })

})