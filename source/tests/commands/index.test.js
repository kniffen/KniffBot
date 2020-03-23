import assert from "assert"

import commands from "../../bot/commands"

describe("commands", function() {

  it("should contain all logical and static commands", function() {

    assert.deepEqual(commands.map((command) => ({
      id:       command.id,
      category: command.category,
      services: command.services,
      args:     command.args,
      default:  typeof command.default
    })), [
      {
        id: "cat",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [[]],
        default: "function"
      },
      {
        id: "comic",
        category: "fun",
        services: ["discord"],
        args: [["<amount>"]], 
        default: "function"
      },
      {
        id: "commands",
        category: "info",
        services: ["discord", "twitchIRC"],
        args: [[]],
        default: "function"
      },
      {
        id: "covid19",
        category: "info",
        services: ["discord"],
        args: [[], ["country/state"]],
        default: "function"
      },
      {
        id: "dog",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [[]],
        default: "function"
      },
      {
        id: "8ball",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [["<question>"]],
        default: "function"
      },
      {
        id: "help",
        category: "utility",
        services: ["discord", "twitchIRC"],
        args: [["<command>"]],
        default: "function"
      },
      {
        id: "ping",
        category: "utility", 
        services: ["discord", "twitchIRC"], 
        args: [[]], 
        default: "function"},
      {
        id: "profile",
        category: "utility", 
        services: ["discord"],
        args: [
          [],
          ["location"],
          ["location", "<location>"],
          ["remove", "<item>"],
          ["@username"]
        ], 
        default: "function"
      },
      {
        id: "stats",
        category: "utility", 
        services: ["discord"],
        args: [[]], 
        default: "function"
      },
      {
        id: "throw",
        category: "fun",
        services: ["discord", "twitchIRC"], 
        args: [[],["<thing>"]], 
        default: "function"
      },
      {
        id: "time",
        category: "info",
        services: ["discord", "twitchIRC"], 
        args: [
          [],
          ["<location>"],
          ["@username"]
        ], 
        default: "function"
      },
      {
        id: "weather",
        category: "info",
        services: ["discord", "twitchIRC"], 
        args: [
          [],
          ["<location>"],
          ["@username"]
        ], 
        default: "function"
      },
      {
        id: "wolfram",
        category: "info",
        services: ["discord"],
        args: [["<query>"]], 
        default: "function"
      },
      {
        id: "xkcd",
        category: "fun",
        services: ["discord", "twitchIRC"], 
        args: [[], ["<id>"]], 
        default: "function"
      }
    ])

  })

})