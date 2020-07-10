import assert from "assert"
import sinon  from "sinon"

import DiscordJS from "discord.js"

import * as inspector from "../../bot/utils/inspector"
import * as log       from "../../bot/utils/log"

import mockDiscord from "./mockDiscordClient"

describe("utils/inspector()", function() {
  let bot

  before(async function() {
    sinon.stub(log, "default")
    sinon.stub(console, "error").callsFake(() => { /* ignore */ })

    bot = {
      data: {
        cachedMessages: [
          {
            "channelID": "2001",
            "messageID": "3000",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "1001"}, // role exists, reaction exists, user does not have role
              {"roleID": "0002", "emojiID": "😱"},  // role exists, reaction exists, user does not have role
              {"roleID": "0003", "emojiID": "1003"}, // role exists, reaction does not exist, user has role
              {"roleID": "0004", "emojiID": "1004"}, // role does not exist, reaction exists
            ]
          },
          {
            "channelID": "2001",
            "messageID": "3001",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "1001"}, 
              {"roleID": "0002", "emojiID": "😱"},  
              {"roleID": "0003", "emojiID": "1003"},
              {"roleID": "0004", "emojiID": "1004"},
            ]
          },
          {
            "channelID": "2002",
            "messageID": "3000",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "1001"}, 
              {"roleID": "0002", "emojiID": "😱"},  
              {"roleID": "0003", "emojiID": "1003"},
              {"roleID": "0004", "emojiID": "1004"},
            ]
          },
          {
            "channelID": "2003",
            "messageID": "3000",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "1001"}, 
              {"roleID": "0002", "emojiID": "😱"},  
              {"roleID": "0003", "emojiID": "1003"},
              {"roleID": "0004", "emojiID": "1004"},
            ]
          }
        ]
      },
      discord: null
    }
  })

  after(function() {
    sinon.restore()
  })

  describe("Any", function() {
    before(async function() {
      await inspector.default("foobar", bot)
    })

    it("Should log activities", function() {
      assert.deepEqual(log.default.args, [
        [{label: "foobar",  message: "Running inspector"}],
        [{label: "foobar",  message: "Inspector finished"}]
      ])

      log.default.resetHistory()
    })
  })

  describe("Discord", function() {
    let client, guild
    const channels  = []
    const messages  = []
    const members   = []
    const roles     = []
    const reactions = []

    before(async function() {
      client = mockDiscord()
      guild  = client.createGuild()

      channels[0] = client.createChannel({id: "2000"})
      channels[1] = client.createChannel({id: "2001", type: "text"})
      channels[2] = client.createChannel({id: "2002", type: "text"})

      members[0] = client.createMember({id: "4000", username: "foobar"})

      messages[0] = client.createMessage({id: "3000", channel: channels[1]})

      reactions[0] = client.createReaction({message: messages[0], emoji: {id: "1001", name: "foo"}, users: [members[0].user]})
      reactions[1] = client.createReaction({message: messages[0], emoji: {id: "bar",  name: "😱" }, users: [members[0].user]})
      reactions[2] = client.createReaction({message: messages[0], emoji: {id: "1004", name: "baz"}, users: [members[0].user]})

      roles[0] = client.createRole({id: "0001", name: "role-0001"})
      roles[1] = client.createRole({id: "0002", name: "role-0002"})
      roles[2] = client.createRole({id: "0003", name: "role-0003"})
      roles[3] = client.createRole({id: "0005", name: "role-0005"})

      members[0].roles.add(roles[2])
      members[0].roles.add(roles[3])

      sinon.spy(client.channels, "fetch")
      sinon.spy(channels[1].messages, "fetch")
      sinon.spy(channels[2].messages, "fetch")
      
      bot.discord = client

      await inspector.default("discord", bot)
    })

    it("should cache messages", function() {
      assert.deepEqual(client.channels.fetch.args, [
        ["2001"],
        ["2001"],
        ["2002"],
        ["2003"]
      ])

      assert.deepEqual(channels[1].messages.fetch.args, [
        ["3000"],
        ["3001"]
      ])

      assert.deepEqual(channels[2].messages.fetch.args, [
        ["3000"]
      ])
    })
    
    it("should add appropriate roles", function() {
      const members = guild.members.cache.array()

      assert.deepEqual(members[0].roles.cache.array(), [
        {id: "0003", name: "role-0003"},
        {id: "0005", name: "role-0005"},
        {id: "0001", name: "role-0001"},
        {id: "0002", name: "role-0002"},
      ])
    })

    it("Should log activities", function() {
      assert.deepEqual(log.default.args, [
        [{label: "discord", message: "Running inspector"}],
        [{label: "discord", message: "Unable to find message with ID \"3001\""}],
        [{label: "discord", message: "Unable to find message with ID \"3000\""}],
        [{label: "discord", message: "Unable to find channel with ID \"2003\""}],
        [{label: "discord", message: "Inspector finished"}],
      ])

      log.default.resetHistory()
    })

  })

})
