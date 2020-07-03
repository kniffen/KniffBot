import assert from "assert"
import sinon  from "sinon"

import DiscordJS from "discord.js"

import * as inspector from "../../bot/utils/inspector"
import * as log       from "../../bot/utils/log"
import * as saveData  from "../../bot/utils/saveData"

import mockDiscord from "./mockDiscordClient"

describe("utils/inspector()", function() {
  let bot

  before(async function() {
    sinon.stub(log, "default")
    sinon.stub(saveData, "default").callsFake(() => { /* ignore */ })

    bot = {
      data: {
        cachedMessages: [
          {
            "channelID": "2001",
            "messageID": "3000",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "0011"},
              {"roleID": "0002", "emojiID": "😱"},
              {"roleID": "0004", "emojiID": "0014"}
            ]
          },
          {
            "channelID": "2001",
            "messageID": "3001",
            "roleReactions": [
              {"roleID": "0003", "emojiID": "0013"},
              {"roleID": "0004", "emojiID": "0014"}
            ]
          },
          {
            "channelID": "2002",
            "messageID": "3000",
            "roleReactions": [
              {"roleID": "0001", "emojiID": "0013"},
              {"roleID": "0003", "emojiID": "😱"}
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
      members[1] = client.createMember({id: "4001", username: "foobaz"})

      messages[0] = client.createMessage({id: "3000", channel: channels[1]})

      reactions[0] = client.createReaction({message: messages[0], emoji: {id: "0011", name: "foo"}, users: [members[0].user]})
      reactions[1] = client.createReaction({message: messages[0], emoji: {id: "0012", name: "😱" }, users: [members[1].user]})
      reactions[2] = client.createReaction({message: messages[0], emoji: {id: "0013", name: "baz"}, users: [members[0].user, members[1].user]})

      roles[0] = client.createRole({id: "0001", name: "role-0001"})
      roles[1] = client.createRole({id: "0002", name: "role-0002"})
      roles[2] = client.createRole({id: "0003", name: "role-0003"})

      members[0].roles.add(roles[0])
      members[0].roles.add(roles[1])
      members[0].roles.add(roles[2])

      members[1].roles.add(roles[0])

      sinon.spy(client.channels, "fetch")
      sinon.spy(channels[1].messages, "fetch")
      sinon.spy(channels[2].messages, "fetch")
      
      bot.discord = client

      await inspector.default("discord", bot)
    })

    it("should remove deleted messages from data.cachedMessages", function() {
      assert.deepEqual(client.channels.fetch.args, [
        ["2001"],
        ["2001"],
        ["2002"]
      ])

      assert.deepEqual(channels[1].messages.fetch.args, [
        ["3000"],
        ["3001"]
      ])

      assert.deepEqual(channels[2].messages.fetch.args, [
        ["3000"]
      ])

      assert.deepEqual(bot.data.cachedMessages, [
        {
          "channelID": "2001",
          "messageID": "3000",
          "roleReactions": [
            {"roleID": "0001", "emojiID": "0011"},
            {"roleID": "0002", "emojiID": "😱"}
          ]
        },
      ])

      assert.equal(saveData.default.args.length, 3)
    })
    
    it("should add and remove appropriate roles", function() {
      const _members = guild.members.cache.array()

      assert.deepEqual(_members[0].roles.cache.array(), [
        {id: "0001", name: "role-0001"},
        {id: "0003", name: "role-0003"}
      ])

      assert.deepEqual(_members[1].roles.cache.array(), [
        {id: "0002", name: "role-0002"}
      ])
    })
  
    it("Should log activities", function() {
      assert.deepEqual(log.default.args, [
        [{label: "discord", message: "Running inspector"}],
        [{label: "discord", message: "Removing unwanted role `role-0002` from foobar"}],
        [{label: "discord", message: "Removing unwanted role `role-0001` from foobaz"}],
        [{label: "discord", message: "Adding missing role `role-0002` to foobaz"}],
        [{label: "discord", message: "Inspector finished"}],
      ])

      log.default.resetHistory()
    })

  })

})
