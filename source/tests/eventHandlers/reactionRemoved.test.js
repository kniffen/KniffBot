import assert from "assert"
import sinon  from "sinon"

import reactionRemoved from "../../bot/eventHandlers/reactionRemoved"

describe("eventHandlers/reactionRemoved()", function() {

  let createReaction, user, bot, member

  before(function() {
    sinon.stub(console, "error").callsFake(() => { /* be quiet */ })

    member = {
      roles: {
        remove: sinon.spy(async (role) => role ? undefined : new Error("error-member-roles"))
      }
    }

    createReaction = (channelID, messageID, emojiID) => ({
      emoji: {
        id: emojiID
      },
      message: {
        id: messageID,
        channel: {
          id: channelID,
          guild: {
            members: {
              fetch: sinon.spy(async (id) => {
                if (id == "foo") {
                  return member
                } else {
                  throw new Error("error-guild-members")
                }
              })
            },
            roles: {
              fetch: sinon.spy(async (id) => {
                if (id == "qux") {
                  return {foo: "bar"}
                } else {
                  throw new Error("error-guild-roles")
                }
              })
            }
          }
        }
      }
    })

    bot = {
      data: {
        cachedMessages: [
          {
            channelID: "bar",
            messageID: "baz",
            roleReactions: [
              {roleID: "qux", emojiID: "quux"}
            ]
          }
        ]
      }
    }
  })

  after(function() {
    sinon.restore()
  })

  it("Should remove roles from users if the reaction is tied to a role", async function() {
    const reactions = []

    reactions[0] = createReaction("bar",   "baz",   "quux")
    reactions[1] = createReaction("bar",   "baz",   "quux")
    reactions[2] = createReaction("corge", "baz",   "quux")
    reactions[3] = createReaction("bar",   "corge", "quux")
    reactions[4] = createReaction("bar",   "baz",   "corge")
    reactions[5] = createReaction("bar",   "baz",   "quux")

    // Works as expected
    await reactionRemoved(reactions[0], {id: "foo"}, bot)
    assert.equal(reactions[0].message.channel.guild.members.fetch.args[0][0], "foo")
    assert.equal(reactions[0].message.channel.guild.roles.fetch.args[0][0],   "qux")
    assert.deepEqual(member.roles.remove.args[0][0], {foo: "bar"})

    // missing user
    await reactionRemoved(reactions[1], {id: "corge"}, bot)
    assert.equal(reactions[1].message.channel.guild.members.fetch.args[0][0], "corge")
    assert.equal(reactions[1].message.channel.guild.roles.fetch.args.length, 0)
    assert.equal(member.roles.remove.args.length, 1)
    assert.equal(console.error.args[0][0].message, "error-guild-members")
    
    // missing channel
    await reactionRemoved(reactions[2], {id: "foo"}, bot)
    assert.equal(reactions[2].message.channel.guild.members.fetch.args.length, 0)
    assert.equal(reactions[2].message.channel.guild.roles.fetch.args.length, 0)
    assert.equal(member.roles.remove.args.length, 1)
    assert.equal(console.error.args.length, 1)

    // missing message
    await reactionRemoved(reactions[3], {id: "foo"}, bot)
    assert.equal(reactions[3].message.channel.guild.members.fetch.args.length, 0)
    assert.equal(reactions[3].message.channel.guild.roles.fetch.args.length, 0)
    assert.equal(member.roles.remove.args.length, 1)
    assert.equal(console.error.args.length, 1)

    // missing emoji
    await reactionRemoved(reactions[4], {id: "foo"}, bot)
    assert.equal(reactions[4].message.channel.guild.members.fetch.args.length, 0)
    assert.equal(reactions[3].message.channel.guild.roles.fetch.args.length, 0)
    assert.equal(member.roles.remove.args.length, 1)
    assert.equal(console.error.args.length, 1)

    // missing role
    bot.data.cachedMessages[0].roleReactions[0].roleID = "corge"
    await reactionRemoved(reactions[5], {id: "foo"}, bot)
    assert.equal(reactions[5].message.channel.guild.members.fetch.args[0][0], "foo")
    assert.equal(reactions[5].message.channel.guild.roles.fetch.args[0][0],   "corge")
    assert.equal(member.roles.remove.args.length, 1)
    assert.equal(console.error.args[1][0].message, "error-guild-roles")

  })

})