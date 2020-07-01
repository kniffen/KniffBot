import assert from "assert"

import commands from "../../bot/commands"

describe("commands", function() {

  it("should contain all logical and static commands", function() {

    assert.deepEqual(commands.map((command) => ({
      id:           command.id,
      category:     command.category,
      services:     command.services,
      args:         command.args,
      isRestricted: command.isRestricted,
      default:      typeof command.default
    })), [
      {
        id: "addrolereact",
        category: "utility", 
        services: ["discord"],
        args: [
          ["<message id>", "<:emoji:>", "<@role>"],
        ],
        isRestricted: true,
        default: "function"
      },
      {
        id: "cat",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [[]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "comic",
        category: "fun",
        services: ["discord"],
        args: [["<amount>"]],
        isRestricted: false, 
        default: "function"
      },
      {
        id: "commands",
        category: "info",
        services: ["discord", "twitchIRC"],
        args: [[]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "covid19",
        category: "info",
        services: ["discord"],
        args: [[], ["country/state"]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "dog",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [[]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "8ball",
        category: "fun",
        services: ["discord", "twitchIRC"],
        args: [["<question>"]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "help",
        category: "utility",
        services: ["discord", "twitchIRC"],
        args: [["<command>"]],
        isRestricted: false,
        default: "function"
      },
      {
        id: "ping",
        category: "utility", 
        services: ["discord", "twitchIRC"], 
        args: [[]],
        isRestricted: false,
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
        isRestricted: false,
        default: "function"
      },
      {
        id: "removerolereact",
        category: "utility", 
        services: ["discord"],
        args: [
          ["<message id>"],
          ["<message id>", "<@role>"],
        ],
        isRestricted: true,
        default: "function"
      },
      {
        id: "stats",
        category: "utility", 
        services: ["discord"],
        args: [[]], 
        isRestricted: true,
        default: "function"
      },
      {
        id: "throw",
        category: "fun",
        services: ["discord", "twitchIRC"], 
        args: [[],["<thing>"]], 
        isRestricted: false,
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
        isRestricted: false,
        default: "function"
      },
      {
        id: "uptime",
        category: "info",
        services: ["discord"], 
        args: [[]], 
        isRestricted: false,
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
        isRestricted: false,
        default: "function"
      },
      {
        id: "wolfram",
        category: "info",
        services: ["discord"],
        args: [["<query>"]], 
        isRestricted: false,
        default: "function"
      },
      {
        id: "xkcd",
        category: "fun",
        services: ["discord", "twitchIRC"], 
        args: [[], ["<id>"]], 
        isRestricted: false,
        default: "function"
      }
    ])

  })

})