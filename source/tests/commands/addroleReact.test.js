import assert     from "assert"
import sinon      from "sinon"
import DiscordJS  from "discord.js"

import * as saveData        from "../../bot/utils/saveData"
import * as addRoleReactCmd from "../../bot/commands/addRoleReact"

import mockDiscord from "../utils/mockDiscordClient"

describe("commands/addRoleReact()", function() {

  let bot, guild, original
  const channels = []
  const members  = []
  const roles    = []

  before(function() {
    bot = {
      discord: mockDiscord(),
      data: {
        settings: {
          prefix: "??"
        },
        cachedMessages: [
          {
            messageID: "400000000",
            channelID: "200000000",
            roleReactions: [
              {emojiID: "😀", roleID: "300000000"},
              {emojiID: "😍", roleID: "310000000"}
            ]
          },
          {
            messageID: "400000000",
            channelID: "210000000",
            roleReactions: [
              {emojiID: "🤪", roleID: "320000000"}
            ]
          }
        ]
      }
    }

    guild       = bot.discord.createGuild()
    channels[0] = bot.discord.createChannel({type: "text", id: "200000000"})
    channels[1] = bot.discord.createChannel({type: "text", id: "210000000"})
    members[0]  = bot.discord.createMember({id: "500000000", username: "foo"})
    members[1]  = bot.discord.createMember({id: "510000000", username: "bar"})
    roles[0]    = bot.discord.createRole({id:"300000000"})
    original    = bot.discord.createMessage({id: "400000000"})

    original.react    = sinon.spy()
    
    members[1].roles.add(roles[0])

    bot.discord.user = members[0].user

    sinon.stub(saveData, "default").callsFake(() => { /* ignore */ })
    sinon.stub(members[0].roles, "add")
    sinon.stub(members[0].roles, "remove")
  })

  after(function() {
    sinon.restore()
  })

  afterEach(function() {
    original.react.resetHistory()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(addRoleReactCmd, {
      id:           "addrolereact",
      category:     "utility",
      services:     ["discord"],
      args:         [["<message id>", "<:emoji:>", "<@role>"]],
      isRestricted: true,
      default:      addRoleReactCmd.default
    })
  })

  it("Should tie reactions to roles for a given message", async function() {
    original.mentions = { roles: new DiscordJS.Collection() }
    original.mentions.roles.set(roles[0].id, roles[0])

    const message = {
      command: {
        args: ["400000000", "😱", "@someone"]
      },
      emojis: [
        {id: "😱"}
      ],
      original
    }

    const expected = {
      command:  message.command,
      emojis:   message.emojis,
      original: message.original
    }

    const actual = await addRoleReactCmd.default(message, bot)

    assert.deepEqual(bot.data.cachedMessages, [
      {
        messageID: "400000000",
        channelID: "200000000",
        roleReactions: [
          {emojiID: "😱", roleID: "300000000"},
          {emojiID: "😍", roleID: "310000000"}
        ]
      },
      {
        messageID: "400000000",
        channelID: "210000000",
        roleReactions: [
          {emojiID: "🤪", roleID: "320000000"}
        ]
      }
    ])

    assert.deepEqual(actual, expected)

    assert.deepEqual(members[0].roles.add.args, [[roles[0]]])
    assert.deepEqual(members[0].roles.remove.args, [[roles[0]]])
    assert.deepEqual(original.react.args, [["😱"]])
    assert.deepEqual(saveData.default.args, [[bot.data]])
  })

  it("Should handle missing messages", async function() {
    original.mentions = { roles: new DiscordJS.Collection() }

    const message = {
      command: {
        args: ["410000000", "⛵", "@someone"]
      },
      emojis: [
        {id: "⛵"}
      ],
      original
    }

    const expected = {
      command:  message.command,
      emojis:   message.emojis,
      original: message.original,
      isReply:  true,
      output:   "Something went wrong 😱\nDo `??help addrolereact` for usage."
    }

    const actual = await addRoleReactCmd.default(message, bot)

    assert.deepEqual(bot.data.cachedMessages, [
      {
        messageID: "400000000",
        channelID: "200000000",
        roleReactions: [
          {emojiID: "😱", roleID: "300000000"},
          {emojiID: "😍", roleID: "310000000"}
        ]
      },
      {
        messageID: "400000000",
        channelID: "210000000",
        roleReactions: [
          {emojiID: "🤪", roleID: "320000000"}
        ]
      }
    ])

    assert.deepEqual(actual, expected)
  })

  it("Should handle unknown roles", async function() {
    original.mentions = { roles: new DiscordJS.Collection() }

    const message = {
      command: {
        args: ["400000000", "⛵", "@someone"]
      },
      emojis: [
        {id: "⛵"}
      ],
      original
    }

    const expected = {
      command:  message.command,
      emojis:   message.emojis,
      original: message.original,
      isReply:  true,
      output:   "Something went wrong 😱\nDo `??help addrolereact` for usage."
    }

    const actual = await addRoleReactCmd.default(message, bot)

    assert.deepEqual(bot.data.cachedMessages, [
      {
        messageID: "400000000",
        channelID: "200000000",
        roleReactions: [
          {emojiID: "😱", roleID: "300000000"},
          {emojiID: "😍", roleID: "310000000"}
        ]
      },
      {
        messageID: "400000000",
        channelID: "210000000",
        roleReactions: [
          {emojiID: "🤪", roleID: "320000000"}
        ]
      }
    ])

    assert.deepEqual(actual, expected)
  })

  it("Should handle unknown emoji", async function() {
    original.react    = sinon.spy(async function() { throw new Error("foobar") })
    original.mentions = { roles: new DiscordJS.Collection() }
    original.mentions.roles.set(roles[0].id, roles[0])

    const message = {
      command: {
        args: ["400000000", "⛵", "@someone"]
      },
      emojis: [
        {id: "⛵"}
      ],
      original
    }

    const expected = {
      command:  message.command,
      emojis:   message.emojis,
      original: message.original,
      isReply:  true,
      output:   "Something went wrong 😱\nDo `??help addrolereact` for usage."
    }

    const actual = await addRoleReactCmd.default(message, bot)

    assert.deepEqual(bot.data.cachedMessages, [
      {
        messageID: "400000000",
        channelID: "200000000",
        roleReactions: [
          {emojiID: "😱", roleID: "300000000"},
          {emojiID: "😍", roleID: "310000000"}
        ]
      },
      {
        messageID: "400000000",
        channelID: "210000000",
        roleReactions: [
          {emojiID: "🤪", roleID: "320000000"}
        ]
      }
    ])

    assert.deepEqual(actual, expected)
  })

})