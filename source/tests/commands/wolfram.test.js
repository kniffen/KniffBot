import assert from "assert"
import sinon  from "sinon"

import deepCopy from "../../bot/utils/deepCopy"
import * as wolframCmd from "../../bot/commands/wolfram"

describe("commands/wolfram()", function() {

  const bot = {
    settings: {
      prefix: "??",
      color: 0xFF0000
    },
    wolframAlpha: {}
  }

  it("Should have appropriate properties", function() {
    assert.deepEqual(wolframCmd, {
      id:           "wolfram",
      category:     "info",
      services:     ["discord"],
      args:         [["<query>"]],
      isRestricted: false,
      default:      wolframCmd.default
    })
  })

  it("should output a specific error message if there are missing arguments", async function() {
    const message = await wolframCmd.default({
      command: {
        args: []
      }
    }, bot)

    assert.deepEqual(message, {
      command: {
        args: []
      },
      output: "Something went wrong 😱\nDo `??help wolfram` for usage."
    })
  })

  it("should output a rich embed with query results", async function() {
    const result = {
      data: {
        queryresult: {
          sources: {
            url: "foo.bar"
          },
          pods: [
            {
              title: "foo",
              subpods: [
                {
                  plaintext: "bar"
                }
              ]
            },
            {
              title: "baz",
              subpods: [
                {plaintext: "qux"},
              ]
            },
            {
              title: "baz",
              subpods: [
                {img: {src: "bar.foo"}}
              ]
            }
          ]
        }
      }
    }

    bot.wolframAlpha.query = sinon.spy(async () => result)

    const messages = []
    const expected = []

    messages[0] = {command: {args: ["foo", "bar"]}}
    messages[1] = {command: {args: ["foo", "bar"]}}

    expected[0] = deepCopy(messages[0], {
      output: {
        title:       "bar",
        color:       0xFF0000,
        url:         "foo.bar",
        image:       {url: "bar.foo"},
        author:      undefined,
        description: undefined,
        footer:      undefined,
        thumbnail:   undefined,
        timestamp:   undefined,
        file:        undefined,
        files:       [],
        fields: [
          {
            inline: false,
            name:   "baz",
            value:  "qux"
          }
        ]
      }
    })

    expected[1] = deepCopy(expected[0])
    expected[1].output.url = undefined

    messages[0] = await wolframCmd.default(messages[0], bot)
    delete result.data.queryresult.sources
    messages[1] = await wolframCmd.default(messages[1], bot)


    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])

  })

  it("should output a specific error message if the query did not resolve", async function() {
    bot.wolframAlpha.query = sinon.spy(async () => { throw new Error("foobar") })
    
    const message = await wolframCmd.default({
      command: {args: ["foo", "bar"]}
    }, bot)

    assert.deepEqual(message, {
      command: {args: ["foo", "bar"]},
      output:  "Could not find any Wolfram|Alpha data for **foo bar**"
    })

  })

})