import assert     from "assert"
import sinon      from "sinon"
import DiscordJS  from "discord.js"

import * as saveData        from "../../bot/utils/saveData"
import * as removeRoleReactCmd from "../../bot/commands/removeRoleReact"

import mockDiscord from "../utils/mockDiscordClient"

describe("commands/removeRoleReact()", function() {

  let bot, guild
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
    roles[1]    = bot.discord.createRole({id:"310000000"})
    roles[2]    = bot.discord.createRole({id:"330000000"})

    members[1].roles.add(roles[0])
    members[1].roles.add(roles[1])

    bot.discord.user = members[0].user

    sinon.stub(saveData, "default").callsFake(() => { /* ignore */ })
    sinon.stub(members[0].roles, "add")
    sinon.stub(members[0].roles, "remove")
  })

  after(function() {
    sinon.restore()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(removeRoleReactCmd, {
      id:           "removerolereact",
      category:     "utility",
      services:     ["discord"],
      args:         [
        ["<message id>"],
        ["<message id>", "<@role>"]
      ],
      isRestricted: true,
      default:      removeRoleReactCmd.default
    })
  })

  it("Should remove reactions tied to roles from a given message", async function() {
    const originals = []
    const messages  = []
    const expected  = []
    const actual    = []

    for (let i = 0; i < 2; i++) {
      originals[i] = bot.discord.createMessage({id: "400000000"})
      originals[i].mentions = { roles: new DiscordJS.Collection() }
      
      if (i == 0) originals[i].mentions.roles.set(roles[0].id, roles[0])

      bot.discord.createReaction({
        channel: channels[0],
        message: originals[i],
        emoji: {
          id:   "😀",
          name: "😀"
        },
        users: [members[1].user]
      })

      bot.discord.createReaction({
        channel: channels[0],
        message: originals[i],
        emoji: {
          id:   "😍",
          name: "😍"
        },
        users: [members[1].user]
      })
      
      messages[i] = {
        command: {
          args: i == 0 ? ["400000000", "@someone"] : ["400000000"]
        },
        original: originals[i]
      }

      expected[i] = {
        command:  messages[i].command,
        original: originals[i]
      }
    }

    actual[0] = await removeRoleReactCmd.default(messages[0], bot)
    assert.deepEqual(saveData.default.args[0], [bot.data])
    
    actual[1] = await removeRoleReactCmd.default(messages[1], bot)
    assert.deepEqual(saveData.default.args[1], [bot.data])

    assert.deepEqual(actual, expected)

    assert.deepEqual(bot.data.cachedMessages, [
      {
        channelID: "210000000",
        messageID: "400000000",
        roleReactions: [
          {emojiID: "🤪", roleID: "320000000"}
        ]
      }
    ])
  })

  it("Should handle missing messages", async function() {
    const messages = []
    const expected = []
    const actual   = []

    messages[0] = {command: {args: ["420000000"]}}
    messages[1] = {command: {args: ["420000000", "@someone"]}}
    expected[0] = {command: messages[0].command, isReply: true, output: "Sorry, I was unable to find that message."} 
    expected[1] = {command: messages[1].command, isReply: true, output: "Sorry, I was unable to find that message."} 

    actual[0] = await removeRoleReactCmd.default(messages[0], bot)
    actual[1] = await removeRoleReactCmd.default(messages[1], bot)
  
    assert.deepEqual(actual, expected)
  })

  it("Should handle unknown roles", async function() {
    const original = bot.discord.createMessage({id: "430000000"})
    const message  = {command: {args: ["430000000"]}, original}
    const expected = {
      command: message.command, 
      isReply: true, 
      output: "Something went wrong 😱\nDo `??help removerolereact` for usage.",
      original
    } 

    original.mentions = { roles: new DiscordJS.Collection() }
    original.mentions.roles.set(roles[2].id, roles[2])

    const actual = await removeRoleReactCmd.default(message, bot)
  
    assert.deepEqual(actual, expected)
  })
  
})